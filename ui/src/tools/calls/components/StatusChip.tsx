import Chip from '@mui/material/Chip';

interface StatusChipProps {
  status: string;
}

const getStatusColor = (
  status: string
): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'failed':
    case 'busy':
    case 'no-answer':
      return 'error';
    case 'in-progress':
    case 'ringing':
    case 'queued':
      return 'warning';
    case 'canceled':
      return 'default';
    default:
      return 'info';
  }
};

const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <Chip
      label={status}
      size="small"
      color={getStatusColor(status)}
      variant="outlined"
    />
  );
};

export default StatusChip;
