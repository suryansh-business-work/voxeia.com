import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import SplitPane from 'react-split-pane';
import { useParams } from 'react-router-dom';
import DialerPanel from './components/DialerPanel';
import CallLogsPanelCard from './components/CallLogsPanelCard';
import ChatPanel from './components/ChatPanel';
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

const BORDER_RADIUS = '4px';

const AgentCallPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { socket } = useSocket();
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [events, setEvents] = useState<ConversationEvent[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activePhone, setActivePhone] = useState('');
  const [historySelection, setHistorySelection] = useState<HistorySelection | null>(null);

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

  const panelSx = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
  };

  return (
    <Box
      sx={{
        height: '100%',
        mx: { xs: -1, sm: -2, md: -3 },
        my: { xs: -1, sm: -2 },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '& .SplitPane': { position: 'relative !important' as string },
        '& .Pane': { overflow: 'hidden' },
        '& .Resizer': {
          background: 'transparent',
          opacity: 1,
          zIndex: 1,
          boxSizing: 'border-box',
          backgroundClip: 'padding-box',
        },
        '& .Resizer.vertical': {
          width: 6,
          borderLeft: '2px solid transparent',
          borderRight: '2px solid transparent',
          cursor: 'col-resize',
          '&:hover': { borderLeft: '2px solid', borderRight: '2px solid', borderColor: 'primary.main' },
        },
      }}
    >
      {/* @ts-expect-error react-split-pane types mismatch with React 18 */}
      <SplitPane split="vertical" minSize={220} maxSize={400} defaultSize={280} style={{ flex: 1, position: 'relative' }}>
        <Box sx={panelSx}>
          <DialerPanel
            agentId={agentId}
            activeCallSid={activeCallSid}
            isCallActive={isCallActive}
            activePhone={activePhone}
            onCallStarted={handleCallStarted}
            onCallEnded={handleCallEnded}
            historySelection={historySelection}
          />
        </Box>
        {/* @ts-expect-error react-split-pane types mismatch with React 18 */}
        <SplitPane split="vertical" minSize={300} maxSize={-300} defaultSize="65%" style={{ position: 'relative' }}>
          <Box sx={panelSx}>
            <CallLogsPanelCard onSelectLog={handleSelectLog} />
          </Box>
          <Box sx={panelSx}>
            <ChatPanel events={events} isActive={isCallActive} />
          </Box>
        </SplitPane>
      </SplitPane>
    </Box>
  );
};

export default AgentCallPage;
