import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import theme from './theme/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import CallsPage from './tools/calls/CallsPage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Header />
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <CallsPage />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
