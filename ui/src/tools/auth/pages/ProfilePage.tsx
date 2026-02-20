import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import AppBreadcrumb from '../../../components/AppBreadcrumb';
import { profileValidationSchema } from '../auth.validation';
import { updateProfileApi, uploadProfilePhotoApi } from '../auth.api';
import { useAuth } from '../../../context/AuthContext';

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Profile' },
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: { name: user?.name || '' },
    validationSchema: profileValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const response = await updateProfileApi(values);
        if (response.success && response.data) {
          updateUser(response.data);
          toast.success('Profile updated!');
        }
      } catch {
        toast.error('Failed to update profile');
      } finally {
        setSaving(false);
      }
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadProfilePhotoApi(file);
      if (response.success && response.data) {
        updateUser(response.data);
        toast.success('Photo updated!');
      }
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <AppBreadcrumb items={breadcrumbItems} />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>My Profile</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>Manage your account settings</Typography>
      </Box>

      <Card sx={{ maxWidth: 600, mx: 'auto', borderTop: '3px solid', borderTopColor: 'primary.main' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.profilePhoto || undefined}
                sx={{ width: 100, height: 100, fontSize: 40 }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                sx={{
                  position: 'absolute', bottom: 0, right: 0,
                  bgcolor: 'primary.main', color: '#fff',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 32, height: 32,
                }}
              >
                {uploading ? <CircularProgress size={16} color="inherit" /> : <CameraAltIcon fontSize="small" />}
              </IconButton>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoUpload}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {user?.email}
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth label="Full Name" name="name"
                value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name} disabled={saving}
              />
              <TextField fullWidth label="Email" value={user?.email || ''} disabled />
              <Button type="submit" variant="contained" disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : undefined}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
