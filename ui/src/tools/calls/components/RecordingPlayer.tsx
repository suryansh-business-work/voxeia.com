import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MicIcon from '@mui/icons-material/Mic';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

interface RecordingPlayerProps {
  recordingUrl: string | null;
  recordingDuration: string | null;
  userReply: string | null;
}

const RecordingPlayer = ({ recordingUrl, recordingDuration, userReply }: RecordingPlayerProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {recordingUrl ? (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <MicIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={600}>
              Call Recording
            </Typography>
            {recordingDuration && (
              <Chip
                label={`${recordingDuration}s`}
                size="small"
                variant="outlined"
                color="info"
              />
            )}
          </Box>
          <audio controls preload="metadata" style={{ width: '100%', maxWidth: 400 }}>
            <source src={recordingUrl} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MicIcon fontSize="small" color="disabled" />
          <Typography variant="body2" color="text.secondary">
            No recording available
          </Typography>
        </Box>
      )}

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <HeadsetMicIcon fontSize="small" color="secondary" />
          <Typography variant="body2" fontWeight={600}>
            User Reply (Transcription)
          </Typography>
        </Box>
        {userReply ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              &ldquo;{userReply}&rdquo;
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No reply recorded yet
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RecordingPlayer;
