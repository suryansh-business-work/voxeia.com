import twilio from 'twilio';
import { envConfig } from '../config';
import CallLog from '../calllogs/calllogs.models';
import { CallLogItem, CallLogsQuery, CallResponse, VoiceOption } from './calls.models';
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
  voice: VoiceOption = 'Polly.Joanna-Neural',
  agentId?: string,
  userId?: string,
  language: string = 'en-US'
): Promise<CallResponse> => {
  try {
    const twilioClient = getTwilioClient();
    
    const baseUrl = getTunnelUrl() || envConfig.BASE_URL;
    const isPublicUrl = !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1');

    let recordBlock = '';
    if (isPublicUrl) {
      recordBlock = `
  <Say voice="${voice}" language="${language}">Please leave your response after the beep. Press the hash key when you are done.</Say>
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
  <Say voice="${voice}" language="${language}">Thank you for your response. Goodbye!</Say>`;
    } else {
      recordBlock = `
  <Say voice="${voice}" language="${language}">Thank you. Goodbye!</Say>`;
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="${language}">${escapeXml(message)}</Say>${recordBlock}
</Response>`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createOptions: any = {
      to,
      from: envConfig.TWILIO_PHONE_NUMBER,
      twiml,
      record: true,
      recordingChannels: 'dual',
    };

    if (isPublicUrl) {
      createOptions.recordingStatusCallback = `${baseUrl}/api/calls/webhooks/recording-status`;
      createOptions.recordingStatusCallbackEvent = ['completed'];
    }

    const call = await twilioClient.calls.create(createOptions);

    // Save call log to MongoDB
    await CallLog.create({
      callSid: call.sid,
      agentId: agentId || null,
      userId: userId || null,
      from: call.from,
      to: call.to,
      status: call.status,
      direction: call.direction || 'outbound-api',
      startTime: (call.dateCreated || new Date()).toISOString(),
      language,
      voice,
    });

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
    return { success: false, message: errMsg };
  }
};

export const getCallLogs = async (
  query: CallLogsQuery
): Promise<{ logs: CallLogItem[]; total: number }> => {
  const { page = 1, pageSize = 10, status, to, from, agentId } = query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (to) filter.to = { $regex: to, $options: 'i' };
  if (from) filter.from = { $regex: from, $options: 'i' };
  if (agentId) filter.agentId = agentId;

  const [docs, total] = await Promise.all([
    CallLog.find(filter)
      .sort({ startTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    CallLog.countDocuments(filter),
  ]);

  const logs: CallLogItem[] = docs.map((doc) => ({
    _id: doc._id.toString(),
    callSid: doc.callSid,
    agentId: doc.agentId?.toString() || null,
    from: doc.from,
    to: doc.to,
    status: doc.status,
    direction: doc.direction,
    duration: doc.duration,
    startTime: doc.startTime || '',
    endTime: doc.endTime || null,
    price: doc.price,
    priceUnit: doc.priceUnit,
    recordingUrl: doc.recordingUrl,
    recordingSid: doc.recordingSid,
    recordingDuration: doc.recordingDuration,
    userReply: doc.userReply,
    language: doc.language,
    voice: doc.voice,
  }));

  return { logs, total };
};

/** Update a call log entry (e.g. when recording completes or call ends) */
export const updateCallLog = async (
  callSid: string,
  update: Partial<{
    status: string;
    duration: string;
    endTime: Date;
    price: string | null;
    recordingUrl: string | null;
    recordingSid: string | null;
    recordingDuration: string | null;
    userReply: string | null;
  }>
): Promise<void> => {
  await CallLog.findOneAndUpdate({ callSid }, update);
};

export const getRecordingForCall = async (
  callSid: string
): Promise<{
  recordingUrl: string | null;
  recordingSid: string | null;
  recordingDuration: string | null;
  userReply: string | null;
}> => {
  const doc = await CallLog.findOne({ callSid });
  if (doc && doc.recordingSid) {
    return {
      recordingUrl: doc.recordingUrl,
      recordingSid: doc.recordingSid,
      recordingDuration: doc.recordingDuration,
      userReply: doc.userReply,
    };
  }

  // Fallback: fetch from Twilio API
  const twilioClient = getTwilioClient();
  let recordingUrl: string | null = null;
  let recordingSid: string | null = null;
  let recordingDuration: string | null = null;

  const recordings = await twilioClient.recordings.list({ callSid, limit: 1 });
  if (recordings.length > 0) {
    const rec = recordings[0];
    recordingSid = rec.sid;
    recordingUrl = `/api/calls/recordings/${rec.sid}/audio`;
    recordingDuration = rec.duration;
  }

  return { recordingUrl, recordingSid, recordingDuration, userReply: null };
};
