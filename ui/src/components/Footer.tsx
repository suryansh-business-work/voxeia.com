import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 4,
          height: 4,
          bgcolor: 'primary.main',
          boxShadow: (t) => `0 0 6px ${alpha(t.palette.primary.main, 0.4)}`,
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
      >
        Exyconn &copy; {new Date().getFullYear()} &middot; AI-Powered Calling Agent
      </Typography>
      <Box
        sx={{
          width: 4,
          height: 4,
          bgcolor: 'primary.main',
          boxShadow: (t) => `0 0 6px ${alpha(t.palette.primary.main, 0.4)}`,
        }}
      />
    </Box>
  );
};

export default Footer;
