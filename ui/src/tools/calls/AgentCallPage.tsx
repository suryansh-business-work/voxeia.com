import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import DialerPanel from './components/DialerPanel';
import CallLogsPanelCard from './components/CallLogsPanelCard';
import ChatPanel from './components/ChatPanel';
import { ConversationEvent } from './calls.types';
import { useSocket } from '../../context/SocketContext';

const AgentCallPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { socket } = useSocket();
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [events, setEvents] = useState<ConversationEvent[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activePhone, setActivePhone] = useState('');

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Agents', href: '/agents' },
    { label: 'Call Mode' },
  ];

  const handleCallStarted = useCallback((callSid: string, phone: string, initialMsg?: string) => {
    setActiveCallSid(callSid);
    setActivePhone(phone);
    setIsCallActive(true);
    setEvents(initialMsg ? [{
      callSid, type: 'ai_message', content: initialMsg, timestamp: new Date().toISOString(),
    }] : []);
  }, []);

  const handleCallEnded = useCallback(() => {
    setIsCallActive(false);
    setActiveCallSid(null);
    setActivePhone('');
  }, []);

  useEffect(() => {
    if (!socket || !activeCallSid) return;
    socket.emit('join:call', activeCallSid);

    const handleUpdate = (event: ConversationEvent) => {
      if (event.callSid !== activeCallSid) return;
      setEvents((prev) => [...prev, event]);
      if (event.type === 'call_ended') setIsCallActive(false);
    };

    socket.on('conversation:update', handleUpdate);
    return () => {
      socket.off('conversation:update', handleUpdate);
      socket.emit('leave:call', activeCallSid);
    };
  }, [socket, activeCallSid]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', px: { xs: 1, md: 0 } }}>
      <AppBreadcrumb items={breadcrumbItems} />
      <Grid container spacing={0} sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 'auto', md: '100%' }, borderRight: { md: '1px solid' }, borderColor: { md: 'divider' }, p: 1 }}>
          <DialerPanel
            agentId={agentId}
            activeCallSid={activeCallSid}
            isCallActive={isCallActive}
            activePhone={activePhone}
            onCallStarted={handleCallStarted}
            onCallEnded={handleCallEnded}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 400, md: '100%' }, borderRight: { md: '1px solid' }, borderColor: { md: 'divider' }, p: 1 }}>
          <CallLogsPanelCard />
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 300, md: '100%' }, p: 1 }}>
          <ChatPanel events={events} isActive={isCallActive} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentCallPage;
