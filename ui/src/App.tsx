import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './tools/auth/pages/LoginPage';
import SignupPage from './tools/auth/pages/SignupPage';
import ForgotPasswordPage from './tools/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './tools/auth/pages/ResetPasswordPage';
import ProfilePage from './tools/auth/pages/ProfilePage';
import DashboardPage from './tools/calls/DashboardPage';
import AgentsListPage from './tools/agents/pages/AgentsListPage';
import CreateAgentPage from './tools/agents/pages/CreateAgentPage';
import EditAgentPage from './tools/agents/pages/EditAgentPage';
import ContactsPage from './tools/contacts/ContactsPage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
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
                maxWidth={false}
                sx={{
                  flex: 1,
                  py: { xs: 1, sm: 2 },
                  px: { xs: 1, sm: 2, md: 3 },
                }}
              >
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                  {/* Protected routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/agents" element={<ProtectedRoute><AgentsListPage /></ProtectedRoute>} />
                  <Route path="/agents/create" element={<ProtectedRoute><CreateAgentPage /></ProtectedRoute>} />
                  <Route path="/agents/:agentId/edit" element={<ProtectedRoute><EditAgentPage /></ProtectedRoute>} />
                  <Route path="/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />

                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Container>
              <Footer />
            </Box>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
