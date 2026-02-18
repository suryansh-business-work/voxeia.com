import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MicIcon from '@mui/icons-material/Mic';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface RecordingPlayerProps {
  recordingUrl: string | null;
  recordingDuration: string | null;
  userReply: string | null;
  aiMessages?: string[];
}

const RecordingPlayer = ({ recordingUrl, recordingDuration, userReply, aiMessages }: RecordingPlayerProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {recordingUrl ? (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <MicIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={600}>Call Recording</Typography>
            {recordingDuration && (
              <Chip label={`${recordingDuration}s`} size="small" variant="outlined" color="info" />
            )}
          </Box>
          <audio controls preload="metadata" style={{ width: '100%', maxWidth: 400 }}>
            <source src={recordingUrl} type="audio/mpeg" />
          </audio>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MicIcon fontSize="small" color="disabled" />
          <Typography variant="body2" color="text.secondary">No recording available</Typography>
        </Box>
      )}

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Transcription</Typography>

        {aiMessages && aiMessages.length > 0 && (
          <Box sx={{ mb: 1 }}>
            {aiMessages.map((msg, idx) => (
              <Box key={`ai-${idx}`} sx={{ display: 'flex', gap: 1, mb: 0.8 }}>
                <SmartToyIcon sx={{ fontSize: 16, color: 'primary.main', mt: 0.3, flexShrink: 0 }} />
                <Box sx={{ p: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', flex: 1 }}>
                  <Typography variant="caption" fontWeight={600} color="primary.main">AI Agent</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.82rem' }}>
                    &ldquo;{msg}&rdquo;
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {userReply ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <PersonIcon sx={{ fontSize: 16, color: 'success.main', mt: 0.3, flexShrink: 0 }} />
            <Box sx={{ p: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', flex: 1 }}>
              <Typography variant="caption" fontWeight={600} color="success.main">User</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.82rem' }}>
                &ldquo;{userReply}&rdquo;
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No user reply recorded yet</Typography>
        )}
      </Box>
    </Box>
  );
};

export default RecordingPlayer;
