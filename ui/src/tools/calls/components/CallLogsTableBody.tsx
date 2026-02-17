import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { CallLogItem } from '../calls.types';
import StatusChip from './StatusChip';

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
  { id: 'direction', label: 'Direction' },
  { id: 'duration', label: 'Duration (s)' },
  { id: 'startTime', label: 'Start Time' },
];

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString();
};

const CallLogsTableBody = ({ logs, order, orderBy, onSort }: CallLogsTableBodyProps) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                  No call logs found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.callSid} hover>
                <TableCell>{log.to}</TableCell>
                <TableCell>{log.from}</TableCell>
                <TableCell>
                  <StatusChip status={log.status} />
                </TableCell>
                <TableCell>{log.direction}</TableCell>
                <TableCell>{log.duration}</TableCell>
                <TableCell>{formatDate(log.startTime)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CallLogsTableBody;
