import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useParams, useSearchParams } from 'react-router-dom';
import DialerPanel from './components/DialerPanel';
import CallLogsPanelCard from './components/CallLogsPanelCard';
import ChatPanel from './components/ChatPanel';
import CostPanel from './components/CostPanel';
import { ConversationEvent, CallLogItem } from './calls.types';
import { fetchCallDetail } from './calls.api';
import { useSocket } from '../../context/SocketContext';

interface HistorySelection {
  to: string;
  voice: string;
  language: string;
  aiEnabled: boolean;
  systemPrompt: string;
  message: string;
}

/** Agent call page with 3-column top row and full-width call logs below */
const AgentCallPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [searchParams] = useSearchParams();
  const initialPhone = searchParams.get('phone') || '';
  const { socket } = useSocket();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileTab, setMobileTab] = useState(0);
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [events, setEvents] = useState<ConversationEvent[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activePhone, setActivePhone] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [historySelection, setHistorySelection] = useState<HistorySelection | null>(null);

  useEffect(() => {
    if (!isCallActive) { setCallDuration(0); return; }
    const t = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [isCallActive]);

  const handleCallStarted = useCallback((callSid: string, phone: string, initialMsg?: string) => {
    setActiveCallSid(callSid);
    setActivePhone(phone);
    setIsCallActive(true);
    setHistorySelection(null);
    setEvents(initialMsg ? [{
      callSid, type: 'ai_message', content: initialMsg, timestamp: new Date().toISOString(),
    }] : []);
  }, []);

  const handleCallEnded = useCallback(() => {
    setIsCallActive(false);
    setActiveCallSid(null);
    setActivePhone('');
  }, []);

  const handleSelectLog = useCallback(async (log: CallLogItem) => {
    try {
      const detail = await fetchCallDetail(log.callSid);
      const msgs: ConversationEvent[] = (detail?.data?.conversationMessages || []).map(
        (m: { role: string; content: string; timestamp: string }) => ({
          callSid: log.callSid,
          type: m.role === 'user' ? 'user_message' as const : 'ai_message' as const,
          content: m.content,
          timestamp: m.timestamp,
        })
      );
      setEvents(msgs);
    } catch {
      setEvents([]);
    }
    setActiveCallSid(null);
    setIsCallActive(false);
    setActivePhone('');
    setHistorySelection({
      to: log.to,
      voice: log.voice || 'Polly.Joanna-Neural',
      language: log.language || 'en-US',
      aiEnabled: Boolean(log.agentId),
      systemPrompt: '',
      message: '',
    });
  }, []);

  useEffect(() => {
    if (!socket || !activeCallSid) return;
    socket.emit('join:call', activeCallSid);

    const handleUpdate = (event: ConversationEvent) => {
      if (event.callSid !== activeCallSid) return;
      setEvents((prev) => [...prev, event]);
      if (event.type === 'call_ended') {
        setIsCallActive(false);
        setActiveCallSid(null);
        setActivePhone('');
      }
    };

    socket.on('conversation:update', handleUpdate);
    return () => {
      socket.off('conversation:update', handleUpdate);
      socket.emit('leave:call', activeCallSid);
    };
  }, [socket, activeCallSid]);

  const dialerNode = (
    <DialerPanel
      agentId={agentId}
      initialPhone={initialPhone}
      activeCallSid={activeCallSid}
      isCallActive={isCallActive}
      activePhone={activePhone}
      onCallStarted={handleCallStarted}
      onCallEnded={handleCallEnded}
      historySelection={historySelection}
    />
  );

  const logsNode = <CallLogsPanelCard onSelectLog={handleSelectLog} />;

  const chatNode = (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <ChatPanel events={events} isActive={isCallActive} />
    </Box>
  );

  const costNode = (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <CostPanel callDuration={callDuration} isCallActive={isCallActive} />
    </Box>
  );

  /* ── Mobile / Tablet layout (stacked with tabs) ──────── */
  if (isMobile) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flex: '0 0 auto', overflow: 'auto', maxHeight: '50%', p: 0.5 }}>
          {dialerNode}
        </Box>
        <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <Tabs
            value={mobileTab}
            onChange={(_, v) => setMobileTab(v)}
            variant="fullWidth"
            sx={{
              minHeight: 36,
              '& .MuiTab-root': { minHeight: 36, fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 },
            }}
          >
            <Tab label="Call Logs" />
            <Tab label="Chat" />
            <Tab label="Cost" />
          </Tabs>
          <Box sx={{ flex: 1, overflow: 'auto', p: 0.5 }}>
            {mobileTab === 0 && logsNode}
            {mobileTab === 1 && chatNode}
            {mobileTab === 2 && costNode}
          </Box>
        </Box>
      </Box>
    );
  }

  /* ── Desktop layout ─────────────────────────────────────────
     Left:  Dialer (fixed width, scrollable)
     Right: top row = Chat | Cost (flexible height)
            bottom   = Call Logs (full width of right pane)
     Full viewport height — no page-level scroll
  ──────────────────────────────────────────────────────────── */
  return (
    <Box sx={{ display: 'flex', gap: 1, height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      {/* ── Left: Dialer (fixed width, internal scroll) ── */}
      <Box sx={{ flex: '0 0 320px', width: 320, overflow: 'auto', height: '100%' }}>
        {dialerNode}
      </Box>

      {/* ── Right: Chat+Cost on top, Logs below ── */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', overflow: 'hidden' }}>
        {/* Top: Live Conversation + Cost side by side — takes ~50% */}
        <Box sx={{ display: 'flex', gap: 1, flex: '1 1 50%', minHeight: 280, overflow: 'hidden' }}>
          <Box sx={{ flex: '1 1 0', minWidth: 0, height: '100%', overflow: 'hidden' }}>
            {chatNode}
          </Box>
          <Box sx={{ flex: '0 0 280px', width: 280, height: '100%', overflow: 'auto' }}>
            {costNode}
          </Box>
        </Box>

        {/* Bottom: Call Logs — takes ~50% */}
        <Box sx={{ flex: '1 1 50%', minHeight: 200, overflow: 'auto' }}>{logsNode}</Box>
      </Box>
    </Box>
  );
};

export default AgentCallPage;
