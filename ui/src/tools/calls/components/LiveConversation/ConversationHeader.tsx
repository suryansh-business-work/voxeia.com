import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

interface ConversationHeaderProps {
  callSid: string;
  phoneNumber: string;
  isActive: boolean;
  messageCount: number;
}

const ConversationHeader = ({
  phoneNumber,
  isActive,
  messageCount,
}: ConversationHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        background: isActive
          ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
          : 'linear-gradient(135deg, #424242 0%, #616161 100%)',
        color: '#fff',
        flexWrap: 'wrap',
      }}
    >
      <PhoneInTalkIcon sx={{ fontSize: 22 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: '#fff' }}>
          {phoneNumber}
        </Typography>
      </Box>

      {/* Live indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isActive ? '#69f0ae' : '#bdbdbd',
            ...(isActive && {
              '@keyframes livePulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(105,240,174,0.7)' },
                '70%': { boxShadow: '0 0 0 6px rgba(105,240,174,0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(105,240,174,0)' },
              },
              animation: 'livePulse 2s ease-out infinite',
            }),
          }}
        />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
          {isActive ? 'Live' : 'Ended'}
        </Typography>
      </Box>

      <Chip
        label={`${messageCount} msg${messageCount !== 1 ? 's' : ''}`}
        size="small"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.7rem',
          height: 22,
        }}
      />
    </Box>
  );
};

export default ConversationHeader;
