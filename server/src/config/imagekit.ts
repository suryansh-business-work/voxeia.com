import ImageKit from '@imagekit/nodejs';
import { envConfig } from './index';

let imagekitInstance: ImageKit | null = null;

export const getImageKit = (): ImageKit | null => {
  if (!envConfig.IMAGEKIT_PRIVATE_KEY) {
    return null;
  }
  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({
      privateKey: envConfig.IMAGEKIT_PRIVATE_KEY,
    });
  }
  return imagekitInstance;
};

/**
 * Upload a recording to ImageKit from a Twilio recording URL.
 */
export const uploadRecordingToImageKit = async (
  recordingSid: string,
  twilioRecordingUrl: string
): Promise<string | null> => {
  const ik = getImageKit();
  if (!ik) {
    console.log('[ImageKit] Not configured — skipping upload');
    return null;
  }

  try {
    const accountSid = envConfig.TWILIO_ACCOUNT_SID;
    const authToken = envConfig.TWILIO_AUTH_TOKEN;
    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(`${twilioRecordingUrl}.mp3`, {
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      console.error(`[ImageKit] Failed to fetch recording from Twilio: ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await ik.files.upload({
      file: buffer.toString('base64'),
      fileName: `${recordingSid}.mp3`,
      folder: '/recordings/',
    });

    console.log(`[ImageKit] Recording uploaded: ${result.url}`);
    return result.url ?? null;
  } catch (error) {
    console.error('[ImageKit] Upload failed:', error);
    return null;
  }
};

/**
 * Upload an agent photo to ImageKit.
 */
export const uploadAgentPhoto = async (
  fileName: string,
  fileBuffer: Buffer
): Promise<string | null> => {
  const ik = getImageKit();
  if (!ik) {
    console.log('[ImageKit] Not configured — skipping upload');
    return null;
  }

  try {
    const result = await ik.files.upload({
      file: fileBuffer.toString('base64'),
      fileName,
      folder: '/agents/',
    });

    return result.url ?? null;
  } catch (error) {
    console.error('[ImageKit] Agent photo upload failed:', error);
    return null;
  }
};
