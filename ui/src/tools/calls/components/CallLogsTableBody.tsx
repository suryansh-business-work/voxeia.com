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
}

const headCells: { id: keyof CallLogItem; label: string }[] = [
  { id: 'to', label: 'To' },
  { id: 'from', label: 'From' },
  { id: 'status', label: 'Status' },
  { id: 'duration', label: 'Duration (s)' },
  { id: 'startTime', label: 'Start Time' },
];

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString();
};

interface ExpandableRowProps {
  log: CallLogItem;
}

const ExpandableRow = ({ log }: ExpandableRowProps) => {
  const [open, setOpen] = useState(false);
  const hasRecording = Boolean(log.recordingUrl);
  const hasReply = Boolean(log.userReply);

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: open ? 'unset' : undefined } }}>
        <TableCell sx={{ width: 48, p: 0.5 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{log.to}</TableCell>
        <TableCell>{log.from}</TableCell>
        <TableCell>
          <StatusChip status={log.status} />
        </TableCell>
        <TableCell>{log.duration}</TableCell>
        <TableCell>{formatDate(log.startTime)}</TableCell>
        <TableCell sx={{ width: 60 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {hasRecording && (
              <Tooltip title="Has recording">
                <MicIcon fontSize="small" color="primary" />
              </Tooltip>
            )}
            {hasReply && (
              <Tooltip title="Has user reply">
                <ChatBubbleOutlineIcon fontSize="small" color="secondary" />
              </Tooltip>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 1 }}>
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

const CallLogsTableBody = ({ logs, order, orderBy, onSort }: CallLogsTableBodyProps) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 48 }} />
            {headCells.map((cell) => (
              <TableCell key={cell.id}>
                <TableSortLabel
                  active={orderBy === cell.id}
                  direction={orderBy === cell.id ? order : 'asc'}
                  onClick={() => onSort(cell.id)}
                >
                  {cell.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell sx={{ width: 60 }}>Media</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                  No call logs found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => <ExpandableRow key={log.callSid} log={log} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CallLogsTableBody;
