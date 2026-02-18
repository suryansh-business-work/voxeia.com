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

/** Check if content contains HTML tags */
const containsHtml = (text: string): boolean => /<[a-z][\s\S]*>/i.test(text);

const ConversationMessage = ({ event }: ConversationMessageProps) => {
  const isUser = event.type === 'user_message';
  const isThinking = event.type === 'ai_thinking';
  const isSilence = event.type === 'silence';
  const isEnded = event.type === 'call_ended';

  if (isEnded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: 'error.main', px: 1.5, py: 0.4 }}>
          <CallEndIcon sx={{ fontSize: 13, color: '#fff' }} />
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.68rem' }}>
            {event.content}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isSilence) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.5 }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.65rem' }}>
          {event.content}
        </Typography>
      </Box>
    );
  }

  if (isThinking) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.8, ml: 0.5, my: 0.8 }}>
        <Box sx={{ width: 24, height: 24, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SmartToyIcon sx={{ fontSize: 13, color: '#fff' }} />
        </Box>
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', px: 1, py: 0.4 }}>
          <TypingIndicator />
        </Box>
      </Box>
    );
  }

  const time = formatTime(event.timestamp);
  const isHtml = !isUser && containsHtml(event.content);

  return (
    <Box sx={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 0.6, my: 0.8, mx: 0.3 }}>
      <Box sx={{
        width: 24, height: 24,
        bgcolor: isUser ? 'success.main' : 'primary.main',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {isUser ? (
          <PersonIcon sx={{ fontSize: 13, color: '#fff' }} />
        ) : (
          <SmartToyIcon sx={{ fontSize: 13, color: '#fff' }} />
        )}
      </Box>

      <Box sx={{
        maxWidth: '78%',
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        border: isUser ? 'none' : '1px solid',
        borderColor: 'divider',
        px: 1.2, py: 0.6,
      }}>
        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.2, fontSize: '0.6rem', color: isUser ? 'rgba(255,255,255,0.85)' : 'text.secondary' }}>
          {isUser ? 'User' : 'AI Agent'}
        </Typography>
        {isHtml ? (
          <Box
            sx={{
              wordBreak: 'break-word', lineHeight: 1.5, color: 'text.primary', fontSize: '0.78rem',
              '& p': { m: 0 }, '& ul, & ol': { pl: 2, my: 0.5 }, '& li': { mb: 0.2 },
              '& strong': { fontWeight: 700 }, '& em': { fontStyle: 'italic' },
              '& h1, & h2, & h3': { fontSize: '0.85rem', my: 0.5 },
            }}
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
        ) : (
          <Typography variant="body2" sx={{ wordBreak: 'break-word', lineHeight: 1.5, color: isUser ? '#fff' : 'text.primary', fontSize: '0.78rem' }}>
            {event.content}
          </Typography>
        )}
        <Typography variant="caption" sx={{ display: 'block', mt: 0.2, textAlign: isUser ? 'left' : 'right', color: isUser ? 'rgba(255,255,255,0.6)' : 'text.disabled', fontSize: '0.55rem' }}>
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConversationMessage;
