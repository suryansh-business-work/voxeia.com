import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useSearchParams } from 'react-router-dom';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import DialerPanel from './components/DialerPanel';
import CallLogsPanelCard from './components/CallLogsPanelCard';
import ChatPanel from './components/ChatPanel';
import { ConversationEvent } from './calls.types';
import { useSocket } from '../../context/SocketContext';

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Dashboard' },
];

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('agentId') || undefined;
  const { socket } = useSocket();
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [events, setEvents] = useState<ConversationEvent[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activePhone, setActivePhone] = useState('');

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
    <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <AppBreadcrumb items={breadcrumbItems} />
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* LEFT: 25% - Dialer & AI toggle */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 'auto', md: '100%' } }}>
          <DialerPanel
            agentId={agentId}
            activeCallSid={activeCallSid}
            isCallActive={isCallActive}
            activePhone={activePhone}
            onCallStarted={handleCallStarted}
            onCallEnded={handleCallEnded}
          />
        </Grid>
        {/* CENTER: 50% - Call Logs */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 400, md: '100%' } }}>
          <CallLogsPanelCard />
        </Grid>
        {/* RIGHT: 25% - Chat */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 300, md: '100%' } }}>
          <ChatPanel events={events} isActive={isCallActive} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
