import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MicIcon from '@mui/icons-material/Mic';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Tooltip from '@mui/material/Tooltip';
import { CallLogItem } from '../calls.types';
import StatusChip from './StatusChip';
import RecordingPlayer from './RecordingPlayer';

type Order = 'asc' | 'desc';

interface CallLogsTableBodyProps {
  logs: CallLogItem[];
  order: Order;
  orderBy: keyof CallLogItem;
  onSort: (property: keyof CallLogItem) => void;
  onRowClick?: (log: CallLogItem) => void;
}

const headCells: { id: keyof CallLogItem; label: string }[] = [
  { id: 'to', label: 'To' },
  { id: 'status', label: 'Status' },
  { id: 'duration', label: 'Dur(s)' },
  { id: 'startTime', label: 'Time' },
];

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

interface ExpandableRowProps {
  log: CallLogItem;
  onSelect?: (log: CallLogItem) => void;
}

const ExpandableRow = ({ log, onSelect }: ExpandableRowProps) => {
  const [open, setOpen] = useState(false);
  const hasRecording = Boolean(log.recordingUrl);
  const hasReply = Boolean(log.userReply);

  return (
    <>
      <TableRow hover sx={{ cursor: onSelect ? 'pointer' : 'default', '& > *': { borderBottom: open ? 'unset' : undefined } }}>
        <TableCell sx={{ width: 36, p: 0.3 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ py: 0.5, fontSize: '0.78rem' }}>{log.to}</TableCell>
        <TableCell sx={{ py: 0.5 }}>
          <StatusChip status={log.status} />
        </TableCell>
        <TableCell sx={{ py: 0.5, fontSize: '0.78rem' }}>{log.duration}</TableCell>
        <TableCell sx={{ py: 0.5, fontSize: '0.75rem' }}>{formatDate(log.startTime)}</TableCell>
        <TableCell sx={{ width: 72, py: 0.5 }}>
          <Box sx={{ display: 'flex', gap: 0.3, alignItems: 'center' }}>
            {hasRecording && (
              <Tooltip title="Has recording">
                <MicIcon sx={{ fontSize: 15 }} color="primary" />
              </Tooltip>
            )}
            {hasReply && (
              <Tooltip title="Has transcript">
                <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} color="secondary" />
              </Tooltip>
            )}
            {onSelect && (
              <Tooltip title="Load this call">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onSelect(log); }} sx={{ p: 0.3 }}>
                  <OpenInNewIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 1, px: 1 }}>
              <RecordingPlayer
                recordingUrl={log.recordingUrl}
                recordingDuration={log.recordingDuration}
                userReply={log.userReply}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CallLogsTableBody = ({ logs, order, orderBy, onSort, onRowClick }: CallLogsTableBodyProps) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 36, p: 0.3 }} />
            {headCells.map((cell) => (
              <TableCell key={cell.id} sx={{ py: 0.5, fontSize: '0.75rem' }}>
                <TableSortLabel
                  active={orderBy === cell.id}
                  direction={orderBy === cell.id ? order : 'asc'}
                  onClick={() => onSort(cell.id)}
                >
                  {cell.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell sx={{ width: 72, py: 0.5, fontSize: '0.75rem' }}>Media</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontSize: '0.8rem' }}>
                  No call logs found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <ExpandableRow key={log.callSid} log={log} onSelect={onRowClick} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CallLogsTableBody;
