import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import { fetchAgents } from '../agents/agents.api';
import { fetchCallLogs } from '../calls/calls.api';
import { CallLogItem } from '../calls/calls.types';

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Dashboard' },
];

interface MetricItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    totalCalls: 0,
    completedCalls: 0,
    avgDuration: '0s',
  });
  const [recentCalls, setRecentCalls] = useState<CallLogItem[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [agentsRes, callsRes] = await Promise.all([
        fetchAgents({ page: 1, pageSize: 1 }),
        fetchCallLogs({ page: 1, pageSize: 10 }),
      ]);

      const totalAgents = agentsRes.success ? agentsRes.pagination.total : 0;
      const totalCalls = callsRes.success ? callsRes.pagination.total : 0;
      const calls = callsRes.success ? callsRes.data : [];
      const completed = calls.filter((c) => c.status === 'completed').length;

      const totalDuration = calls.reduce((sum, c) => sum + parseInt(c.duration || '0', 10), 0);
      const avg = calls.length > 0 ? Math.round(totalDuration / calls.length) : 0;
      const avgStr = avg >= 60 ? `${Math.floor(avg / 60)}m ${avg % 60}s` : `${avg}s`;

      setMetrics({ totalAgents, totalCalls, completedCalls: completed, avgDuration: avgStr });
      setRecentCalls(calls);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const metricCards: MetricItem[] = [
    { label: 'Total Agents', value: metrics.totalAgents, icon: <SmartToyIcon />, color: '#00897B' },
    { label: 'Total Calls', value: metrics.totalCalls, icon: <PhoneIcon />, color: '#1976D2' },
    { label: 'Completed', value: metrics.completedCalls, icon: <CheckCircleIcon />, color: '#2E7D32' },
    { label: 'Avg Duration', value: metrics.avgDuration, icon: <TrendingUpIcon />, color: '#ED6C02' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1, md: 2 }, py: 1 }}>
      <AppBreadcrumb items={breadcrumbItems} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metricCards.map((m) => (
          <Grid item xs={6} sm={3} key={m.label}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                <Box sx={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${m.color}14`, color: m.color }}>
                  {m.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{m.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Recent Calls</Typography>
          {recentCalls.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No calls yet. Start by creating an agent and making a call.
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& th, & td': { px: 2, py: 1.2, textAlign: 'left', borderBottom: '1px solid', borderColor: 'divider', fontSize: '0.85rem' }, '& th': { fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <thead>
                  <tr>
                    <th>To</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((call) => (
                    <tr key={call.callSid}>
                      <td><Typography variant="body2" fontFamily="monospace">{call.to}</Typography></td>
                      <td>
                        <Box component="span" sx={{ px: 1, py: 0.3, fontSize: '0.75rem', fontWeight: 600, bgcolor: call.status === 'completed' ? 'success.main' : call.status === 'failed' ? 'error.main' : 'warning.main', color: '#fff', display: 'inline-block' }}>
                          {call.status}
                        </Box>
                      </td>
                      <td><Typography variant="body2">{call.duration}s</Typography></td>
                      <td><Typography variant="body2" color="text.secondary">{call.startTime ? new Date(call.startTime).toLocaleString() : '-'}</Typography></td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
