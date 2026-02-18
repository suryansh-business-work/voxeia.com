import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
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

  const messageCount = events.filter(
    (e) => e.type === 'user_message' || e.type === 'ai_message'
  ).length;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{
        px: 2, py: 1.5, bgcolor: 'secondary.main', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        <ChatBubbleOutlineIcon fontSize="small" />
        <Typography variant="subtitle2" sx={{ flex: 1 }}>Live Chat</Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {messageCount} msg{messageCount !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Messages */}
      <CardContent sx={{
        flex: 1, overflowY: 'auto', p: 1.5, bgcolor: '#ece5dd',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 2 },
      }}>
        {events.length === 0 ? (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: 1, opacity: 0.6,
          }}>
            <HeadsetMicIcon sx={{ fontSize: 40, color: '#8d6e63' }} />
            <Typography variant="body2" sx={{ color: '#5d4037', fontWeight: 500, textAlign: 'center' }}>
              {isActive ? 'Waiting for conversation...' : 'Start a call to see chat'}
            </Typography>
          </Box>
        ) : (
          events.map((event, idx) => (
            <ConversationMessage key={`${event.timestamp}-${idx}`} event={event} />
          ))
        )}
        <div ref={endRef} />
      </CardContent>

      {/* Footer */}
      <Box sx={{
        px: 2, py: 0.8, borderTop: '1px solid rgba(0,0,0,0.08)', bgcolor: '#f5f5f5',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.7rem' }}>
          {isActive ? 'Live conversation' : 'No active call'}
        </Typography>
      </Box>
    </Card>
  );
};

export default ChatPanel;
