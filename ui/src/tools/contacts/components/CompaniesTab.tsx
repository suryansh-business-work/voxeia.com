import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import toast from 'react-hot-toast';
import { Company } from '../contacts.types';
import { fetchCompanies, deleteCompanyApi } from '../contacts.api';
import CompanyDialog from './CompanyDialog';

interface CompaniesTabProps {
  onCompanySelect?: (companyId: string) => void;
}

const CompaniesTab = ({ onCompanySelect }: CompaniesTabProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCompanies({ page: page + 1, pageSize, search: search || undefined });
      if (res.success) { setCompanies(res.data); setTotal(res.pagination.total); }
    } catch { toast.error('Failed to load companies'); }
    finally { setLoading(false); }
  }, [page, pageSize, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this company? Contacts will be unlinked.')) return;
    try {
      await deleteCompanyApi(id);
      toast.success('Company deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const handleDialogClose = (saved?: boolean) => {
    setDialogOpen(false);
    setEditCompany(null);
    if (saved) load();
  };

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search companies..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Add Company
        </Button>
      </Box>

      {/* Table */}
      <TableContainer>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : companies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">No companies yet</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Contacts</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((c) => (
                <TableRow
                  key={c._id}
                  sx={{ cursor: onCompanySelect ? 'pointer' : 'default' }}
                  onClick={() => onCompanySelect?.(c._id)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                  </TableCell>
                  <TableCell>
                    {c.industry && <Chip label={c.industry} size="small" variant="outlined" />}
                  </TableCell>
                  <TableCell><Typography variant="body2">{c.phone || '—'}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{c.email || '—'}</Typography></TableCell>
                  <TableCell align="center">
                    <Chip label={c.contactCount} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEditCompany(c); setDialogOpen(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        component="div" count={total} page={page}
        onPageChange={(_, p) => setPage(p)} rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => { setPageSize(+e.target.value); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Dialog */}
      <CompanyDialog open={dialogOpen} company={editCompany} onClose={handleDialogClose} />
    </Box>
  );
};

export default CompaniesTab;
