import { useEffect, useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import CloseIcon from '@mui/icons-material/Close';
import { useSocket } from '../../../../context/SocketContext';
import { ConversationEvent } from '../../calls.types';
import ConversationHeader from './ConversationHeader';
import ConversationMessage from './ConversationMessage';

interface LiveConversationProps {
  callSid: string;
  phoneNumber: string;
  initialMessage?: string;
  onClose: () => void;
}

const LiveConversation = ({
  callSid,
  phoneNumber,
  initialMessage,
  onClose,
}: LiveConversationProps) => {
  const { socket } = useSocket();
  const [events, setEvents] = useState<ConversationEvent[]>(() => {
    if (initialMessage) {
      return [
        {
          callSid,
          type: 'ai_message',
          content: initialMessage,
          timestamp: new Date().toISOString(),
        },
      ];
    }
    return [];
  });
  const [isActive, setIsActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!socket || !callSid) return;

    socket.emit('join:call', callSid);

    const handleUpdate = (event: ConversationEvent) => {
      if (event.callSid !== callSid) return;
      setEvents((prev) => [...prev, event]);
      if (event.type === 'call_ended') setIsActive(false);
    };

    socket.on('conversation:update', handleUpdate);

    return () => {
      socket.off('conversation:update', handleUpdate);
      socket.emit('leave:call', callSid);
    };
  }, [socket, callSid]);

  useEffect(() => {
    scrollToBottom();
  }, [events, scrollToBottom]);

  const messageCount = events.filter(
    (e) => e.type === 'user_message' || e.type === 'ai_message'
  ).length;

  return (
    <Collapse in={true}>
      <Card
        elevation={6}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: isActive ? '#66bb6a' : '#bdbdbd',
        }}
      >
        {/* ─── Header ─── */}
        <Box sx={{ position: 'relative' }}>
          <ConversationHeader
            callSid={callSid}
            phoneNumber={phoneNumber}
            isActive={isActive}
            messageCount={messageCount}
          />
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'rgba(255,255,255,0.8)',
              '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ─── Chat area ─── */}
        <Box
          sx={{
            height: { xs: 320, sm: 400 },
            overflowY: 'auto',
            px: 1.5,
            py: 1.5,
            backgroundColor: '#ece5dd',
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 2,
            },
          }}
        >
          {events.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 1,
                opacity: 0.6,
              }}
            >
              <HeadsetMicIcon sx={{ fontSize: 52, color: '#8d6e63' }} />
              <Typography variant="body2" sx={{ color: '#5d4037', fontWeight: 500 }}>
                Waiting for conversation to begin...
              </Typography>
              <Typography variant="caption" sx={{ color: '#8d6e63' }}>
                The AI will start talking once the call connects
              </Typography>
            </Box>
          ) : (
            events.map((event, idx) => (
              <ConversationMessage key={`${event.timestamp}-${idx}`} event={event} />
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* ─── Status bar ─── */}
        <Box
          sx={{
            px: 2,
            py: 0.8,
            borderTop: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.7rem' }}>
            {isActive ? 'Call in progress — live via Twilio' : 'Call ended'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.7rem' }}>
            {messageCount} message{messageCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Card>
    </Collapse>
  );
};

export default LiveConversation;
