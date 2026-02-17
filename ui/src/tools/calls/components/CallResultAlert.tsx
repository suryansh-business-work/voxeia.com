import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { CallData } from '../calls.types';

interface CallResultAlertProps {
  success: boolean;
  message: string;
  data?: CallData;
}

const CallResultAlert = ({ success, message, data }: CallResultAlertProps) => {
  return (
    <Alert severity={success ? 'success' : 'error'} sx={{ mt: 2 }}>
      <Typography fontWeight={500}>{message}</Typography>
      {data && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            Call SID: <strong>{data.callSid}</strong>
          </Typography>
          <Typography variant="body2">
            Status: <Chip label={data.status} size="small" color="primary" sx={{ ml: 0.5 }} />
          </Typography>
          <Typography variant="body2">
            From: {data.from} &rarr; To: {data.to}
          </Typography>
        </Box>
      )}
    </Alert>
  );
};

export default CallResultAlert;
