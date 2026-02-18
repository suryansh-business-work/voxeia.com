import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { ConversationEvent } from '../../calls.types';
import TypingIndicator from './TypingIndicator';

interface ConversationMessageProps {
  event: ConversationEvent;
}

const formatTime = (ts: string) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const ConversationMessage = ({ event }: ConversationMessageProps) => {
  const isUser = event.type === 'user_message';
  const isThinking = event.type === 'ai_thinking';
  const isSilence = event.type === 'silence';
  const isEnded = event.type === 'call_ended';

  // ─── Call ended badge ────────────────────
  if (isEnded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            backgroundColor: '#ffebee',
            border: '1px solid #ef9a9a',
            px: 2,
            py: 0.6,
            borderRadius: 3,
          }}
        >
          <CallEndIcon sx={{ fontSize: 14, color: '#c62828' }} />
          <Typography variant="caption" sx={{ color: '#c62828', fontWeight: 600 }}>
            {event.content}
          </Typography>
        </Box>
      </Box>
    );
  }

  // ─── Silence indicator ───────────────────
  if (isSilence) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: '0.7rem' }}
        >
          {event.content}
        </Typography>
      </Box>
    );
  }

  // ─── AI thinking (typing indicator) ──────
  if (isThinking) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, ml: 0.5, my: 1 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: '#e3f2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 16, color: '#1565c0' }} />
        </Box>
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '16px 16px 16px 4px',
            px: 1,
            py: 0.5,
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          <TypingIndicator />
        </Box>
      </Box>
    );
  }

  // ─── Chat bubble ─────────────────────────
  const time = formatTime(event.timestamp);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 1,
        my: 1.2,
        mx: 0.5,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          backgroundColor: isUser ? '#e8f5e9' : '#e3f2fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: 16, color: '#2e7d32' }} />
        ) : (
          <SmartToyIcon sx={{ fontSize: 16, color: '#1565c0' }} />
        )}
      </Box>

      {/* Bubble */}
      <Box
        sx={{
          maxWidth: '72%',
          backgroundColor: isUser ? '#dcf8c6' : '#ffffff',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          px: 1.8,
          py: 1,
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        <Typography
          variant="body2"
          sx={{ wordBreak: 'break-word', lineHeight: 1.5, color: '#1a1a1a' }}
        >
          {event.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.4,
            textAlign: isUser ? 'left' : 'right',
            color: '#999',
            fontSize: '0.65rem',
            lineHeight: 1,
          }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConversationMessage;
