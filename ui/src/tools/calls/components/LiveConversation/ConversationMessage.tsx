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

  if (isEnded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: 'error.main', px: 2, py: 0.5 }}>
          <CallEndIcon sx={{ fontSize: 14, color: '#fff' }} />
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
            {event.content}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isSilence) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
          {event.content}
        </Typography>
      </Box>
    );
  }

  if (isThinking) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, ml: 0.5, my: 1 }}>
        <Box sx={{ width: 28, height: 28, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SmartToyIcon sx={{ fontSize: 14, color: '#fff' }} />
        </Box>
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', px: 1.5, py: 0.5 }}>
          <TypingIndicator />
        </Box>
      </Box>
    );
  }

  const time = formatTime(event.timestamp);

  return (
    <Box sx={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 0.8, my: 1, mx: 0.5 }}>
      <Box sx={{
        width: 28, height: 28,
        bgcolor: isUser ? 'success.main' : 'primary.main',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {isUser ? (
          <PersonIcon sx={{ fontSize: 14, color: '#fff' }} />
        ) : (
          <SmartToyIcon sx={{ fontSize: 14, color: '#fff' }} />
        )}
      </Box>

      <Box sx={{
        maxWidth: '72%',
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        border: isUser ? 'none' : '1px solid',
        borderColor: 'divider',
        px: 1.5, py: 0.8,
      }}>
        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.3, fontSize: '0.65rem', color: isUser ? 'rgba(255,255,255,0.85)' : 'text.secondary' }}>
          {isUser ? 'User' : 'AI Agent'}
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: 'break-word', lineHeight: 1.5, color: isUser ? '#fff' : 'text.primary', fontSize: '0.82rem' }}>
          {event.content}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.3, textAlign: isUser ? 'left' : 'right', color: isUser ? 'rgba(255,255,255,0.6)' : 'text.disabled', fontSize: '0.6rem' }}>
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConversationMessage;
