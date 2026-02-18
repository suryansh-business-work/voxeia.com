import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppBreadcrumb from '../../../components/AppBreadcrumb';
import { createAgentValidationSchema, createAgentInitialValues } from '../agents.validation';
import { createAgentApi } from '../agents.api';
import VoiceSelector from '../../voices/VoiceSelector';

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Agents', href: '/agents' },
  { label: 'Create' },
];

const CreateAgentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: createAgentInitialValues,
    validationSchema: createAgentValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await createAgentApi(values);
        if (response.success) {
          toast.success('Agent created!');
          navigate('/agents');
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error('Failed to create agent');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box>
      <AppBreadcrumb items={breadcrumbItems} />
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" sx={{ mb: 3 }}>Create Call Agent</Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth label="Agent Name" name="name"
                value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name} disabled={loading}
                placeholder="e.g., Customer Support Bot"
              />
              <TextField
                fullWidth label="Greeting Message" name="greeting"
                value={formik.values.greeting} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.greeting && Boolean(formik.errors.greeting)}
                helperText={formik.touched.greeting && formik.errors.greeting} disabled={loading}
                multiline rows={2}
              />
              <TextField
                fullWidth label="System Prompt" name="systemPrompt"
                value={formik.values.systemPrompt} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.systemPrompt && Boolean(formik.errors.systemPrompt)}
                helperText={formik.touched.systemPrompt && formik.errors.systemPrompt} disabled={loading}
                multiline rows={4} placeholder="Describe how the AI agent should behave..."
              />

              {/* Voice Selection */}
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Choose Voice</Typography>
                <VoiceSelector
                  value={formik.values.voice}
                  onChange={(v) => formik.setFieldValue('voice', v)}
                  disabled={loading}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/agents')} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : undefined}>
                  {loading ? 'Creating...' : 'Create Agent'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateAgentPage;
