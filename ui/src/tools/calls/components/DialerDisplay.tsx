import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PersonIcon from '@mui/icons-material/Person';
import { keyframes } from '@mui/material/styles';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const ring = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(76,175,80,0.4); }
  70% { box-shadow: 0 0 0 20px rgba(76,175,80,0); }
  100% { box-shadow: 0 0 0 0 rgba(76,175,80,0); }
`;

interface DialerDisplayProps {
  phoneNumber: string;
  isActive: boolean;
  duration: number;
  onHangup: () => void;
}

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const DialerDisplay = ({ phoneNumber, isActive, duration, onHangup }: DialerDisplayProps) => {
  const [elapsed, setElapsed] = useState(duration);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <Card sx={{ bgcolor: 'secondary.dark', color: '#fff', borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{
            width: 70, height: 70, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',
            animation: isActive ? `${ring} 1.5s ease-in-out infinite` : undefined,
          }}>
            <PersonIcon sx={{ fontSize: 36, opacity: 0.8 }} />
          </Box>
        </Box>
        <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 2, mb: 0.5 }}>
          {phoneNumber || 'No number'}
        </Typography>
        <Chip
          label={isActive ? 'Connected' : 'Calling...'}
          size="small"
          sx={{
            bgcolor: isActive ? 'success.main' : 'warning.main',
            color: '#fff', mb: 1,
            animation: !isActive ? `${pulse} 1.5s ease-in-out infinite` : undefined,
          }}
        />
        <Typography variant="h4" sx={{ fontFamily: 'monospace', my: 1 }}>
          {formatDuration(elapsed)}
        </Typography>
        <IconButton
          onClick={onHangup}
          sx={{
            bgcolor: 'error.main', color: '#fff', width: 56, height: 56, mt: 1,
            '&:hover': { bgcolor: 'error.dark' },
          }}
        >
          <CallEndIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

interface DialerIdleProps {
  phoneNumber: string;
}

export const DialerIdle = ({ phoneNumber }: DialerIdleProps) => {
  return (
    <Card sx={{ bgcolor: 'secondary.main', color: '#fff', borderRadius: 3 }}>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{
          width: 70, height: 70, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
        }}>
          <PhoneIcon sx={{ fontSize: 36, opacity: 0.8 }} />
        </Box>
        <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 2, mb: 0.5 }}>
          {phoneNumber || 'Enter a number'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>Ready to call</Typography>
      </CardContent>
    </Card>
  );
};

export default DialerDisplay;
