import fs from 'fs';
import path from 'path';

/**
 * Simple JSON file-based storage for call recordings & transcriptions.
 * Stores data that Twilio sends via webhooks (transcriptions, recording metadata).
 */

const DATA_DIR = path.join(__dirname, '../../data');
const RECORDINGS_FILE = path.join(DATA_DIR, 'recordings.json');

export interface RecordingEntry {
  callSid: string;
  recordingSid: string;
  recordingUrl: string;
  recordingDuration: string;
  timestamp: string;
}

export interface TranscriptionEntry {
  callSid: string;
  recordingSid: string;
  transcriptionText: string;
  transcriptionSid: string;
  timestamp: string;
}

interface StorageData {
  recordings: RecordingEntry[];
  transcriptions: TranscriptionEntry[];
}

const ensureDataDir = (): void => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const readStorage = (): StorageData => {
  ensureDataDir();
  if (!fs.existsSync(RECORDINGS_FILE)) {
    return { recordings: [], transcriptions: [] };
  }
  const raw = fs.readFileSync(RECORDINGS_FILE, 'utf-8');
  return JSON.parse(raw) as StorageData;
};

const writeStorage = (data: StorageData): void => {
  ensureDataDir();
  fs.writeFileSync(RECORDINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

export const saveRecording = (entry: RecordingEntry): void => {
  const data = readStorage();
  // Avoid duplicates
  const exists = data.recordings.find(
    (r) => r.recordingSid === entry.recordingSid
  );
  if (!exists) {
    data.recordings.push(entry);
    writeStorage(data);
  }
};

export const saveTranscription = (entry: TranscriptionEntry): void => {
  const data = readStorage();
  const exists = data.transcriptions.find(
    (t) => t.transcriptionSid === entry.transcriptionSid
  );
  if (!exists) {
    data.transcriptions.push(entry);
    writeStorage(data);
  }
};

export const getRecordingsByCallSid = (callSid: string): RecordingEntry[] => {
  const data = readStorage();
  return data.recordings.filter((r) => r.callSid === callSid);
};

export const getTranscriptionsByCallSid = (callSid: string): TranscriptionEntry[] => {
  const data = readStorage();
  return data.transcriptions.filter((t) => t.callSid === callSid);
};

export const getLatestTranscription = (callSid: string): string | null => {
  const transcriptions = getTranscriptionsByCallSid(callSid);
  if (transcriptions.length === 0) return null;
  // Sort by timestamp desc, return the latest
  transcriptions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return transcriptions[0].transcriptionText;
};

export const getLatestRecording = (callSid: string): RecordingEntry | null => {
  const recordings = getRecordingsByCallSid(callSid);
  if (recordings.length === 0) return null;
  recordings.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return recordings[0];
};
