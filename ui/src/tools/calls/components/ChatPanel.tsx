import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ConversationEvent } from '../calls.types';
import ConversationMessage from './LiveConversation/ConversationMessage';
import { useRef, useEffect } from 'react';

interface ChatPanelProps {
  events: ConversationEvent[];
  isActive: boolean;
}

const ChatPanel = ({ events, isActive }: ChatPanelProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  // Filter out ai_thinking events that are followed by ai_message (resolved thinking)
  const filteredEvents = useMemo(() => {
    return events.filter((event, idx) => {
      if (event.type !== 'ai_thinking') return true;
      // Keep only the last ai_thinking if it has no subsequent ai_message
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{
        px: 2, py: 1, bgcolor: 'primary.main', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ flex: 1, fontSize: '0.8rem' }}>Live Conversation</Typography>
        {isActive && <FiberManualRecordIcon sx={{ fontSize: 10, color: '#4caf50' }} />}
        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
          {messageCount} msg{messageCount !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <CardContent sx={{
        flex: 1, overflowY: 'auto', p: 1.5, bgcolor: 'background.default',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(128,128,128,0.3)' },
      }}>
        {events.length === 0 ? (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: 1, opacity: 0.5,
          }}>
            <HeadsetMicIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, textAlign: 'center', fontSize: '0.8rem' }}>
              {isActive ? 'Waiting for conversation...' : 'Start a call to see the live conversation'}
            </Typography>
          </Box>
        ) : (
          filteredEvents.map((event, idx) => (
            <ConversationMessage key={`${event.timestamp}-${idx}`} event={event} />
          ))
        )}
        <div ref={endRef} />
      </CardContent>

      <Box sx={{
        px: 2, py: 0.6, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          {isActive ? 'Live conversation in progress' : 'No active call'}
        </Typography>
      </Box>
    </Card>
  );
};

export default ChatPanel;
