import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { forgotPasswordValidationSchema } from '../auth.validation';
import { forgotPasswordApi } from '../auth.api';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await forgotPasswordApi(values.email);
        setSent(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Request failed';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 440, width: '100%', borderTop: '3px solid', borderTopColor: 'primary.main', boxShadow: (t) => `0 0 40px ${alpha(t.palette.primary.main, 0.06)}` }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: '#fff', mb: 2, boxShadow: (t) => `0 0 20px ${alpha(t.palette.primary.main, 0.3)}` }}>
              <LockResetIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Forgot Password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Enter your email to receive a reset link</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {sent && <Alert severity="success" sx={{ mb: 2 }}>If the email exists, a password reset link has been sent. Check your inbox.</Alert>}

          {!sent && (
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth label="Email" name="email" type="email"
                  value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email} disabled={loading}
                />
                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : undefined}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Box>
            </form>
          )}

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link component={RouterLink} to="/login" variant="body2">Back to Sign In</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;
