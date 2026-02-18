import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { makeCallValidationSchema, makeCallInitialValues, MakeCallFormValues } from '../calls.validation';
import { makeCall, makeAiCall } from '../calls.api';
import { CallResponse, VoiceOption } from '../calls.types';
import { fetchAgentById } from '../../agents/agents.api';
import { getVoiceLabel } from '../../voices/voices.data';
import VoiceSelector from '../../voices/VoiceSelector';
import DialerDisplay, { DialerIdle } from './DialerDisplay';

interface DialerPanelProps {
  agentId?: string;
  activeCallSid: string | null;
  isCallActive: boolean;
  activePhone: string;
  onCallStarted: (callSid: string, phone: string, initialMsg?: string) => void;
  onCallEnded: () => void;
}

const DialerPanel = ({ agentId, activeCallSid, isCallActive, activePhone, onCallStarted, onCallEnded }: DialerPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

  const formik = useFormik<MakeCallFormValues>({
    initialValues: makeCallInitialValues,
    validationSchema: makeCallValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let response: CallResponse;
        if (values.aiEnabled) {
          response = await makeAiCall({
            to: values.to,
            message: values.message || undefined,
            voice: values.voice as VoiceOption,
            systemPrompt: values.systemPrompt || undefined,
          });
        } else {
          response = await makeCall({
            to: values.to,
            message: values.message || undefined,
            voice: values.voice as VoiceOption,
          });
        }
        if (response.success && response.data) {
          toast.success(values.aiEnabled ? 'AI call started!' : 'Call initiated!');
          onCallStarted(
            response.data.callSid,
            values.to,
            values.aiEnabled ? (values.message || 'Hello! I am your AI assistant.') : undefined
          );
        } else {
          toast.error(response.message);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Call failed';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  // Load agent data if agentId provided
  useEffect(() => {
    if (!agentId) return;
    const loadAgent = async () => {
      try {
        const res = await fetchAgentById(agentId);
        if (res.success && res.data) {
          formik.setFieldValue('aiEnabled', true);
          formik.setFieldValue('systemPrompt', res.data.systemPrompt);
          formik.setFieldValue('voice', res.data.voice);
          formik.setFieldValue('message', res.data.greeting);
        }
      } catch {
        // ignore
      }
    };
    loadAgent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      {/* Dialer visualization */}
      {activeCallSid ? (
        <DialerDisplay
          phoneNumber={activePhone}
          isActive={isCallActive}
          duration={0}
          onHangup={onCallEnded}
        />
      ) : (
        <DialerIdle phoneNumber={formik.values.to} />
      )}

      {/* Call form */}
      <Card sx={{ flex: 1, overflow: 'auto', borderRadius: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                fullWidth size="small" label="Phone Number" name="to"
                placeholder="+911234567890"
                value={formik.values.to} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.to && Boolean(formik.errors.to)}
                helperText={formik.touched.to && formik.errors.to}
                disabled={loading || isCallActive}
              />
              {/* Voice picker button */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                  Voice
                </Typography>
                <Chip
                  icon={<RecordVoiceOverIcon />}
                  label={getVoiceLabel(formik.values.voice)}
                  onClick={() => setVoiceDialogOpen(true)}
                  variant="outlined"
                  disabled={loading || isCallActive}
                  sx={{ width: '100%', justifyContent: 'flex-start', height: 36 }}
                />
              </Box>

              {/* Voice selector dialog */}
              <Dialog
                open={voiceDialogOpen}
                onClose={() => setVoiceDialogOpen(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>Select Voice</DialogTitle>
                <DialogContent>
                  <VoiceSelector
                    value={formik.values.voice}
                    onChange={(v) => {
                      formik.setFieldValue('voice', v);
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setVoiceDialogOpen(false)} variant="contained">
                    Done
                  </Button>
                </DialogActions>
              </Dialog>

              <TextField
                fullWidth size="small" label="Message" name="message"
                value={formik.values.message} onChange={formik.handleChange}
                multiline rows={2} disabled={loading || isCallActive}
              />

              {/* AI toggle */}
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.aiEnabled}
                      onChange={(e) => formik.setFieldValue('aiEnabled', e.target.checked)}
                      size="small" disabled={loading || isCallActive}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SmartToyIcon fontSize="small" />
                      <Typography variant="body2">AI Mode</Typography>
                    </Box>
                  }
                />
                <Collapse in={formik.values.aiEnabled}>
                  <TextField
                    fullWidth size="small" label="System Prompt" name="systemPrompt"
                    value={formik.values.systemPrompt} onChange={formik.handleChange}
                    multiline rows={3} disabled={loading || isCallActive}
                    sx={{ mt: 1 }}
                  />
                </Collapse>
              </Box>

              <Button
                type="submit" variant="contained" fullWidth
                disabled={loading || isCallActive}
                startIcon={loading ? <CircularProgress size={18} /> : formik.values.aiEnabled ? <SmartToyIcon /> : <PhoneForwardedIcon />}
              >
                {loading ? 'Calling...' : formik.values.aiEnabled ? 'Start AI Call' : 'Make Call'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DialerPanel;
