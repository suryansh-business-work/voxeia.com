import { Request, Response } from 'express';
import { makeCallSchema, callLogsQuerySchema } from './calls.validators';
import * as callService from './calls.services';
import { uploadRecordingToImageKit } from '../config/imagekit';
import { envConfig } from '../config';

export const initiateCall = async (req: Request, res: Response): Promise<void> => {
  const parsed = makeCallSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { to, message, voice, agentId, language } = parsed.data;
  const result = await callService.makeCall(to, message, voice, agentId, undefined, language);

  if (!result.success) {
    res.status(500).json(result);
    return;
  }

  res.status(200).json(result);
};

export const fetchCallLogs = async (req: Request, res: Response): Promise<void> => {
  const parsed = callLogsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const { logs, total } = await callService.getCallLogs(parsed.data);

    res.status(200).json({
      success: true,
      message: 'Call logs fetched successfully',
      data: logs,
      pagination: {
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
        total,
      },
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch call logs';
    res.status(500).json({
      success: false,
      message: errMsg,
    });
  }
};

/**
 * Webhook: Called by Twilio when a recording is completed.
 * Twilio POSTs recording metadata here.
 */
export const handleRecordingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      CallSid,
      RecordingSid,
      RecordingUrl,
      RecordingDuration,
      RecordingStatus,
    } = req.body;

    console.log(`[Recording Webhook] CallSid: ${CallSid}, Status: ${RecordingStatus}, RecordingSid: ${RecordingSid}`);

    if (RecordingStatus === 'completed' && RecordingSid) {
      // Upload recording to ImageKit (async, don't block response)
      uploadRecordingToImageKit(RecordingSid, RecordingUrl).then((imagekitUrl) => {
        callService.updateCallLog(CallSid, {
          recordingSid: RecordingSid,
          recordingUrl: imagekitUrl || `/api/calls/recordings/${RecordingSid}/audio`,
          recordingDuration: RecordingDuration || '0',
        });
      });
    }

    // Twilio expects a 200 response with empty body or TwiML
    res.status(200).type('text/xml').send('<Response/>');
  } catch (error) {
    console.error('[Recording Webhook Error]', error);
    res.status(200).type('text/xml').send('<Response/>');
  }
};

/**
 * Webhook: Called by Twilio when transcription of user's reply is ready.
 * Twilio POSTs the transcribed text here.
 */
export const handleTranscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      CallSid,
      RecordingSid,
      TranscriptionSid,
      TranscriptionText,
      TranscriptionStatus,
    } = req.body;

    console.log(`[Transcription Webhook] CallSid: ${CallSid}, Status: ${TranscriptionStatus}, Text: "${TranscriptionText}"`);

    if (TranscriptionStatus === 'completed' && TranscriptionText) {
      await callService.updateCallLog(CallSid, {
        userReply: TranscriptionText,
      });
    }

    res.status(200).type('text/xml').send('<Response/>');
  } catch (error) {
    console.error('[Transcription Webhook Error]', error);
    res.status(200).type('text/xml').send('<Response/>');
  }
};

/**
 * GET /api/calls/:callSid/recording - Get recording details for a specific call
 */
export const getCallRecording = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callSid } = req.params;
    const result = await callService.getRecordingForCall(callSid);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch recording';
    res.status(500).json({
      success: false,
      message: errMsg,
    });
  }
};

/**
 * GET /api/calls/recordings/:recordingSid/audio
 * Proxy endpoint that fetches the recording audio from Twilio with auth
 * and streams it to the client. This avoids the browser Basic Auth prompt.
 */
export const proxyRecordingAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recordingSid } = req.params;
    const accountSid = envConfig.TWILIO_ACCOUNT_SID;
    const authToken = envConfig.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      res.status(500).json({ success: false, message: 'Twilio credentials not configured' });
      return;
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`;

    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(twilioUrl, {
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        message: `Twilio returned ${response.status}: ${response.statusText}`,
      });
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch recording audio';
    console.error('[Recording Proxy Error]', errMsg);
    res.status(500).json({ success: false, message: errMsg });
  }
};
