import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import HistoryIcon from '@mui/icons-material/History';
import toast from 'react-hot-toast';
import { fetchCallLogs } from '../calls.api';
import { CallLogItem } from '../calls.types';
import CallLogsFilters from './CallLogsFilters';
import CallLogsTableBody from './CallLogsTableBody';
import { useSocket } from '../../../context/SocketContext';

type Order = 'asc' | 'desc';

interface CallLogsPanelCardProps {
  onSelectLog?: (log: CallLogItem) => void;
}

const CallLogsPanelCard = ({ onSelectLog }: CallLogsPanelCardProps) => {
  const { socket } = useSocket();
  const [logs, setLogs] = useState<CallLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof CallLogItem>('startTime');
  const loadRef = useRef<() => void>();

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCallLogs({
        page: page + 1, pageSize: rowsPerPage,
        status: statusFilter || undefined,
        to: searchQuery || undefined,
      });
      if (response.success) {
        setLogs(response.data);
        setTotal(response.pagination.total);
      }
    } catch {
      toast.error('Failed to load call logs');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, searchQuery]);

  loadRef.current = loadLogs;

  useEffect(() => { loadLogs(); }, [loadLogs]);

  // Auto-refresh when server emits calllog:updated
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      loadRef.current?.();
    };
    socket.on('calllog:updated', handleUpdate);
    return () => { socket.off('calllog:updated', handleUpdate); };
  }, [socket]);

  const handleSort = (property: keyof CallLogItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      const aVal = a[orderBy] || '';
      const bVal = b[orderBy] || '';
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [logs, order, orderBy]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{
        px: 1.5, py: 0.8, bgcolor: 'secondary.main', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        <HistoryIcon sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ flex: 1, fontSize: '0.8rem' }}>Call Logs</Typography>
        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
          {total} total
        </Typography>
      </Box>
      <CardContent sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <CallLogsFilters
          searchQuery={searchQuery}
          onSearchChange={(val) => { setSearchQuery(val); setPage(0); }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => { setStatusFilter(val); setPage(0); }}
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={28} /></Box>
        ) : (
          <CallLogsTableBody
            logs={sortedLogs}
            order={order}
            orderBy={orderBy}
            onSort={handleSort}
            onRowClick={onSelectLog}
          />
        )}
      </CardContent>
      <TablePagination
        component="div" count={total} page={page}
        onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ borderTop: '1px solid', borderColor: 'divider', '& .MuiTablePagination-toolbar': { minHeight: 36 } }}
      />
    </Card>
  );
};

export default CallLogsPanelCard;
