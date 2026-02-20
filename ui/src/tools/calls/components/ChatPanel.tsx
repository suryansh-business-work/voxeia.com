import { useMemo, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ConversationEvent } from '../calls.types';
import ConversationMessage from './LiveConversation/ConversationMessage';

interface ChatPanelProps {
  events: ConversationEvent[];
  isActive: boolean;
}

const ChatPanel = ({ events, isActive }: ChatPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event, idx) => {
      if (event.type !== 'ai_thinking') return true;
      const nextEvent = events[idx + 1];
      if (nextEvent && (nextEvent.type === 'ai_message' || nextEvent.type === 'call_ended')) {
        return false;
      }
      return true;
    });
  }, [events]);

  const messageCount = events.filter(
    (e) => e.type === 'user_message' || e.type === 'ai_message'
  ).length;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '4px' }}>
      <Box sx={{
        px: 1.5, py: 0.8, bgcolor: 'primary.main', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0,
      }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
        <Typography variant="subtitle2" sx={{ flex: 1, fontSize: '0.78rem' }}>Live Conversation</Typography>
        {isActive && <FiberManualRecordIcon sx={{ fontSize: 10, color: '#4caf50' }} />}
        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem' }}>
          {messageCount} msg{messageCount !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <CardContent
        ref={scrollRef}
        sx={{
          flex: 1, overflowY: 'auto', p: 1, bgcolor: 'background.default',
          minHeight: 0,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(128,128,128,0.3)' },
        }}
      >
        {events.length === 0 ? (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: 1, opacity: 0.5,
          }}>
            <HeadsetMicIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, textAlign: 'center', fontSize: '0.75rem' }}>
              {isActive ? 'Waiting for conversation...' : 'Start a call or select a history entry'}
            </Typography>
          </Box>
        ) : (
          filteredEvents.map((event, idx) => (
            <ConversationMessage key={`${event.timestamp}-${idx}`} event={event} />
          ))
        )}
      </CardContent>

      <Box sx={{
        px: 1.5, py: 0.4, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
          {isActive ? 'Live conversation in progress' : events.length > 0 ? 'Historical conversation' : 'No active call'}
        </Typography>
      </Box>
    </Card>
  );
};

export default ChatPanel;
