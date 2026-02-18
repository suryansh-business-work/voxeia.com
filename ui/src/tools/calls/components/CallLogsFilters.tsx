import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

interface CallLogsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'busy', label: 'Busy' },
  { value: 'no-answer', label: 'No Answer' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'queued', label: 'Queued' },
];

const CallLogsFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CallLogsFiltersProps) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            size="small"
            label="Search by phone"
            placeholder="+911234567890"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallLogsFilters;
