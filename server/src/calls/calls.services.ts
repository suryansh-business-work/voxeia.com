import twilio from 'twilio';
import { envConfig } from '../config';
import { CallLogItem, CallLogsQuery, CallResponse, VoiceOption } from './calls.models';
import { getLatestRecording, getLatestTranscription } from './calls.storage';
import { getTunnelUrl } from '../tunnel';

let client: ReturnType<typeof twilio> | null = null;

const getTwilioClient = () => {
  if (!client) {
    if (!envConfig.TWILIO_ACCOUNT_SID || !envConfig.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials are not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file');
    }
    if (!envConfig.TWILIO_ACCOUNT_SID.startsWith('AC')) {
      throw new Error('Invalid Twilio Account SID. It must start with "AC". Please check your .env file');
    }
    client = twilio(envConfig.TWILIO_ACCOUNT_SID, envConfig.TWILIO_AUTH_TOKEN);
  }
  return client;
};

/**
 * Escapes special XML characters so user text is safe inside TwiML <Say>.
 */
const escapeXml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const makeCall = async (
  to: string,
  message: string,
  voice: VoiceOption = 'Polly.Joanna-Neural'
): Promise<CallResponse> => {
  try {
    const twilioClient = getTwilioClient();
    
    const baseUrl = getTunnelUrl() || envConfig.BASE_URL;
    const isPublicUrl = !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1');

    // Build TwiML — only add <Record> with webhooks if BASE_URL is publicly reachable (e.g. ngrok)
    let recordBlock = '';
    if (isPublicUrl) {
      recordBlock = `
  <Say voice="${voice}" language="en-US">Please leave your response after the beep. Press the hash key when you are done.</Say>
  <Record
    maxLength="120"
    playBeep="true"
    transcribe="true"
    transcribeCallback="${baseUrl}/api/calls/webhooks/transcription"
    recordingStatusCallback="${baseUrl}/api/calls/webhooks/recording-status"
    recordingStatusCallbackEvent="completed"
    finishOnKey="#"
    timeout="10"
  />
  <Say voice="${voice}" language="en-US">Thank you for your response. Goodbye!</Say>`;
    } else {
      recordBlock = `
  <Say voice="${voice}" language="en-US">Thank you. Goodbye!</Say>`;
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="en-US">${escapeXml(message)}</Say>${recordBlock}
</Response>`;

    // record: true records the full call via Twilio API (recordings accessible later)
    // Only add webhook callback if URL is publicly reachable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createOptions: any = {
      to,
      from: envConfig.TWILIO_PHONE_NUMBER,
      twiml,
      record: true,
    };

    if (isPublicUrl) {
      createOptions.recordingStatusCallback = `${baseUrl}/api/calls/webhooks/recording-status`;
      createOptions.recordingStatusCallbackEvent = ['completed'];
    }

    const call = await twilioClient.calls.create(createOptions);

    return {
      success: true,
      message: 'Call initiated successfully',
      data: {
        callSid: call.sid,
        status: call.status,
        from: call.from,
        to: call.to,
        dateCreated: call.dateCreated?.toISOString() || new Date().toISOString(),
      },
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to make call';
    return {
      success: false,
      message: errMsg,
    };
  }
};

export const getCallLogs = async (
  query: CallLogsQuery
): Promise<{ logs: CallLogItem[]; total: number }> => {
  const { page = 1, pageSize = 10, status, to, from } = query;

  const twilioClient = getTwilioClient();
  
  const filters: Record<string, string> = {};
  if (status) filters.status = status;
  if (to) filters.to = to;
  if (from) filters.from = from;

  const calls = await twilioClient.calls.list({
    ...filters,
    limit: pageSize,
    pageSize,
  });

  // For each call, fetch recordings from Twilio API and transcriptions from local storage
  const logs: CallLogItem[] = await Promise.all(
    calls.map(async (call) => {
      let recordingUrl: string | null = null;
      let recordingSid: string | null = null;
      let recordingDuration: string | null = null;

      // Try local storage first
      const localRec = getLatestRecording(call.sid);
      if (localRec) {
        recordingSid = localRec.recordingSid;
        // Use proxy URL so the browser can play without auth
        recordingUrl = `/api/calls/recordings/${localRec.recordingSid}/audio`;
        recordingDuration = localRec.recordingDuration;
      } else {
        // Fallback: fetch from Twilio API
        try {
          const recordings = await twilioClient.recordings.list({
            callSid: call.sid,
            limit: 1,
          });
          if (recordings.length > 0) {
            const rec = recordings[0];
            recordingSid = rec.sid;
            // Use proxy URL so the browser can play without auth
            recordingUrl = `/api/calls/recordings/${rec.sid}/audio`;
            recordingDuration = rec.duration;
          }
        } catch {
          // Recording fetch failed, leave as null
        }
      }

      // Get user reply transcription from local storage
      const userReply = getLatestTranscription(call.sid);

      return {
        callSid: call.sid,
        from: call.from,
        to: call.to,
        status: call.status,
        direction: call.direction,
        duration: call.duration || '0',
        startTime: call.startTime?.toISOString() || '',
        endTime: call.endTime?.toISOString() || '',
        price: call.price,
        priceUnit: call.priceUnit,
        recordingUrl,
        recordingSid,
        recordingDuration,
        userReply,
      };
    })
  );

  return { logs, total: logs.length };
};

/**
 * Get recording details (URL + transcription) for a specific call
 */
export const getRecordingForCall = async (
  callSid: string
): Promise<{
  recordingUrl: string | null;
  recordingSid: string | null;
  recordingDuration: string | null;
  userReply: string | null;
}> => {
  const twilioClient = getTwilioClient();

  let recordingUrl: string | null = null;
  let recordingSid: string | null = null;
  let recordingDuration: string | null = null;

  // Try local storage first
  const localRec = getLatestRecording(callSid);
  if (localRec) {
    recordingSid = localRec.recordingSid;
    recordingUrl = `/api/calls/recordings/${localRec.recordingSid}/audio`;
    recordingDuration = localRec.recordingDuration;
  } else {
    // Fetch from Twilio API
    const recordings = await twilioClient.recordings.list({
      callSid,
      limit: 1,
    });
    if (recordings.length > 0) {
      const rec = recordings[0];
      recordingSid = rec.sid;
      recordingUrl = `/api/calls/recordings/${rec.sid}/audio`;
      recordingDuration = rec.duration;
    }
  }

  const userReply = getLatestTranscription(callSid);

  return { recordingUrl, recordingSid, recordingDuration, userReply };
};
