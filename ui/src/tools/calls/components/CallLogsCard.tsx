import { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import HistoryIcon from '@mui/icons-material/History';
import toast from 'react-hot-toast';
import { fetchCallLogs } from '../calls.api';
import { CallLogItem } from '../calls.types';
import CallLogsFilters from './CallLogsFilters';
import CallLogsTableBody from './CallLogsTableBody';

type Order = 'asc' | 'desc';

const CallLogsCard = () => {
  const [logs, setLogs] = useState<CallLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof CallLogItem>('startTime');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCallLogs({
        page: page + 1,
        pageSize: rowsPerPage,
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

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

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
    <Card>
      <CardHeader
        title="Call Logs"
        subheader="View your call history"
        avatar={<HistoryIcon color="primary" />}
      />
      <CardContent>
        <CallLogsFilters
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(0);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setPage(0);
          }}
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CallLogsTableBody
            logs={sortedLogs}
            order={order}
            orderBy={orderBy}
            onSort={handleSort}
          />
        )}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </CardContent>
    </Card>
  );
};

export default CallLogsCard;
