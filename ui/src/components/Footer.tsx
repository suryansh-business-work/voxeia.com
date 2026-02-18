import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 3,
        textAlign: 'center',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
        width: '100%',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Exyconn &copy; {new Date().getFullYear()} &middot; AI-Powered Calling Agent
      </Typography>
    </Box>
  );
};

export default Footer;
