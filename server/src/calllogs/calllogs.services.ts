import CallLog, { ICallLog } from './calllogs.models';
import { CallLogsQueryInput } from './calllogs.validators';
import { getImageKit } from '../config/imagekit';
import { envConfig } from '../config';

export const saveCallLog = async (
  userId: string,
  data: Partial<ICallLog>
): Promise<ICallLog> => {
  const existing = await CallLog.findOne({ callSid: data.callSid });
  if (existing) {
    Object.assign(existing, data);
    await existing.save();
    return existing;
  }
  return CallLog.create({ userId, ...data });
};

export const getCallLogs = async (
  userId: string,
  query: CallLogsQueryInput
): Promise<{ logs: ICallLog[]; total: number }> => {
  const { page = 1, pageSize = 10, status, to, from, agentId, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const filter: Record<string, unknown> = { userId };
  if (status) filter.status = status;
  if (to) filter.to = { $regex: to, $options: 'i' };
  if (from) filter.from = { $regex: from, $options: 'i' };
  if (agentId) filter.agentId = agentId;
  if (search) {
    filter.$or = [
      { to: { $regex: search, $options: 'i' } },
      { from: { $regex: search, $options: 'i' } },
      { callSid: { $regex: search, $options: 'i' } },
    ];
  }

  const sortObj: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [logs, total] = await Promise.all([
    CallLog.find(filter).sort(sortObj).skip((page - 1) * pageSize).limit(pageSize).populate('agentId', 'name'),
    CallLog.countDocuments(filter),
  ]);

  return { logs, total };
};

export const getCallLogByCallSid = async (
  userId: string,
  callSid: string
): Promise<ICallLog | null> => {
  return CallLog.findOne({ callSid, userId });
};

export const updateCallLogStatus = async (
  callSid: string,
  status: string
): Promise<void> => {
  await CallLog.findOneAndUpdate({ callSid }, { status });
};

/**
 * Upload recording to ImageKit and save the URL in the call log
 */
export const uploadRecordingToImageKit = async (
  callSid: string,
  recordingSid: string
): Promise<string | null> => {
  try {
    const imagekit = getImageKit();
    const accountSid = envConfig.TWILIO_ACCOUNT_SID;
    const authToken = envConfig.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) return null;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`;
    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(twilioUrl, { headers: { Authorization: authHeader } });
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await imagekit.files.upload({
      file: buffer.toString('base64'),
      fileName: `recording_${callSid}_${recordingSid}.mp3`,
      folder: '/twilio-call-bot/recordings',
    });

    // Update call log with ImageKit URL
    await CallLog.findOneAndUpdate(
      { callSid },
      {
        recordingImageKitUrl: uploaded.url ?? null,
        recordingImageKitFileId: uploaded.fileId ?? null,
      }
    );

    return uploaded.url ?? null;
  } catch (error) {
    console.error('[CallLogs] Failed to upload recording to ImageKit:', error);
    return null;
  }
};
