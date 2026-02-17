import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import Box from '@mui/material/Box';

const Header = () => {
  return (
    <AppBar position="static" color="secondary" elevation={0}>
      <Toolbar>
        <PhoneIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Twilio Call Bot
        </Typography>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Phone Call System
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
