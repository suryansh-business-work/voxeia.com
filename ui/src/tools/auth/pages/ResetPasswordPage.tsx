import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPasswordValidationSchema } from '../auth.validation';
import { resetPasswordApi } from '../auth.api';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      if (!token) {
        setError('Invalid reset link');
        return;
      }
      setLoading(true);
      setError('');
      try {
        await resetPasswordApi(token, values.password);
        toast.success('Password reset successfully!');
        navigate('/login');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Reset failed';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LockResetIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">Reset Password</Typography>
            <Typography variant="body2" color="text.secondary">Enter your new password</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth label="New Password" name="password" type="password"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password} disabled={loading}
              />
              <TextField
                fullWidth label="Confirm Password" name="confirmPassword" type="password"
                value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} disabled={loading}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : undefined}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPasswordPage;
