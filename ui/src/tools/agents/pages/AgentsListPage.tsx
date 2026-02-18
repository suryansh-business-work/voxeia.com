import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AppBreadcrumb from '../../../components/AppBreadcrumb';
import { fetchAgents, deleteAgentApi } from '../agents.api';
import { Agent } from '../agents.types';
import AgentCard from './AgentCard';

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Agents' },
];

const AgentsListPage = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAgents({ page: page + 1, pageSize: rowsPerPage, search: search || undefined });
      if (response.success) {
        setAgents(response.data);
        setTotal(response.pagination.total);
      }
    } catch {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  const handleDelete = async (agentId: string) => {
    try {
      await deleteAgentApi(agentId);
      toast.success('Agent deleted');
      loadAgents();
    } catch {
      toast.error('Failed to delete agent');
    }
  };

  return (
    <Box>
      <AppBreadcrumb items={breadcrumbItems} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5">Call Agents</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/agents/create')}>
          Create Agent
        </Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <TextField
            fullWidth size="small" label="Search agents..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : agents.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">No agents yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Create your first call agent to get started</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/agents/create')}>Create Agent</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={2}>
            {agents.map((agent) => (
              <Grid item xs={12} sm={6} md={4} key={agent._id}>
                <AgentCard
                  agent={agent}
                  onSelect={() => navigate(`/dashboard?agentId=${agent._id}`)}
                  onEdit={() => navigate(`/agents/${agent._id}/edit`)}
                  onDelete={() => handleDelete(agent._id)}
                />
              </Grid>
            ))}
          </Grid>
          <TablePagination
            component="div" count={total} page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[6, 10, 25]}
          />
        </>
      )}
    </Box>
  );
};

export default AgentsListPage;
