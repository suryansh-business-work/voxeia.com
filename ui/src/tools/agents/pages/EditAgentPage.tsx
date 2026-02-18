import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppBreadcrumb from '../../../components/AppBreadcrumb';
import { createAgentValidationSchema } from '../agents.validation';
import { fetchAgentById, updateAgentApi } from '../agents.api';
import VoiceSelector from '../../voices/VoiceSelector';

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Agents', href: '/agents' },
  { label: 'Edit' },
];

const EditAgentPage = () => {
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const formik = useFormik({
    initialValues: { name: '', voice: 'Polly.Joanna-Neural', greeting: '', systemPrompt: '' },
    validationSchema: createAgentValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!agentId) return;
      setLoading(true);
      try {
        const response = await updateAgentApi(agentId, values);
        if (response.success) {
          toast.success('Agent updated!');
          navigate('/agents');
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error('Failed to update agent');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!agentId) return;
    const load = async () => {
      try {
        const res = await fetchAgentById(agentId);
        if (res.success && res.data) {
          formik.setValues({
            name: res.data.name,
            voice: res.data.voice,
            greeting: res.data.greeting || '',
            systemPrompt: res.data.systemPrompt,
          });
        } else {
          toast.error('Agent not found');
          navigate('/agents');
        }
      } catch {
        toast.error('Failed to load agent');
        navigate('/agents');
      } finally {
        setFetching(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  if (fetching) {
    return (
      <Box>
        <AppBreadcrumb items={breadcrumbItems} />
        <Card sx={{ maxWidth: 700, mx: 'auto' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[40, 56, 80, 140].map((h, i) => (
              <Skeleton key={i} variant="rounded" height={h} />
            ))}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <AppBreadcrumb items={breadcrumbItems} />
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" sx={{ mb: 3 }}>Edit Call Agent</Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth label="Agent Name" name="name"
                value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name} disabled={loading}
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
                multiline rows={4}
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditAgentPage;
