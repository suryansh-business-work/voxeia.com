import { useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import DialpadIcon from '@mui/icons-material/Dialpad';
import EditIcon from '@mui/icons-material/Edit';
import { FormikProps } from 'formik';
import { getVoiceLabel, getVoiceLanguageCode, getVoicesByLanguage } from '../../voices/voices.data';
import VoiceSelector from '../../voices/VoiceSelector';
import { MakeCallFormValues } from '../calls.validation';
import { translateText } from '../calls.api';
import DialPad from './DialPad';
import LanguageSelect from './LanguageSelect';

interface DialerFormProps {
  formik: FormikProps<MakeCallFormValues>;
  loading: boolean;
  isCallActive: boolean;
  inputMode: number;
  onInputModeChange: (mode: number) => void;
  voiceDialogOpen: boolean;
  onVoiceDialogToggle: (open: boolean) => void;
}

const DialerForm = ({
  formik, loading, isCallActive, inputMode, onInputModeChange,
  voiceDialogOpen, onVoiceDialogToggle,
}: DialerFormProps) => {
  const translatingRef = useRef(false);

  const handleLanguageChange = useCallback(async (lang: string) => {
    const prevLang = formik.values.language;
    formik.setFieldValue('language', lang);

    // Auto-select a compatible voice for the new language
    const voices = getVoicesByLanguage(lang);
    if (voices.length > 0) {
      const currentVoiceLang = getVoiceLanguageCode(formik.values.voice);
      if (currentVoiceLang !== lang) {
        formik.setFieldValue('voice', voices[0].id);
      }
    }

    // Translate message and system prompt if language changed and not English
    if (prevLang !== lang && !translatingRef.current) {
      translatingRef.current = true;
      try {
        const promises: Promise<void>[] = [];
        if (formik.values.message?.trim()) {
          promises.push(
            translateText({ text: formik.values.message, targetLanguage: lang })
              .then((res) => { if (res.success) formik.setFieldValue('message', res.data.translated); })
          );
        }
        if (formik.values.aiEnabled && formik.values.systemPrompt?.trim()) {
          promises.push(
            translateText({ text: formik.values.systemPrompt, targetLanguage: lang })
              .then((res) => { if (res.success) formik.setFieldValue('systemPrompt', res.data.translated); })
          );
        }
        await Promise.all(promises);
      } catch {
        // translation failure is non-critical
      } finally {
        translatingRef.current = false;
      }
    }
  }, [formik]);

  const disabled = loading || isCallActive;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tabs value={inputMode} onChange={(_, v) => onInputModeChange(v)} variant="fullWidth"
          sx={{ minHeight: 32, '& .MuiTab-root': { minHeight: 32, py: 0.3, fontSize: '0.7rem' } }}>
          <Tab icon={<DialpadIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Pad" />
          <Tab icon={<EditIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Manual" />
        </Tabs>

        {inputMode === 0 ? (
          <DialPad value={formik.values.to} onChange={(v) => formik.setFieldValue('to', v)} disabled={disabled} />
        ) : (
          <TextField fullWidth size="small" label="Phone" name="to" placeholder="+911234567890"
            value={formik.values.to} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={formik.touched.to && Boolean(formik.errors.to)}
            helperText={formik.touched.to && formik.errors.to} disabled={disabled} />
        )}

        <Chip icon={<RecordVoiceOverIcon />} label={getVoiceLabel(formik.values.voice)}
          onClick={() => onVoiceDialogToggle(true)} variant="outlined" disabled={disabled}
          sx={{ width: '100%', justifyContent: 'flex-start', height: 32, fontSize: '0.72rem' }} />

        <Dialog open={voiceDialogOpen} onClose={() => onVoiceDialogToggle(false)} maxWidth="md" fullWidth>
          <DialogTitle>Select Voice</DialogTitle>
          <DialogContent>
            <VoiceSelector value={formik.values.voice} onChange={(v) => {
              formik.setFieldValue('voice', v);
              formik.setFieldValue('language', getVoiceLanguageCode(v));
            }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onVoiceDialogToggle(false)} variant="contained">Done</Button>
          </DialogActions>
        </Dialog>

        <LanguageSelect value={formik.values.language} onChange={handleLanguageChange} disabled={disabled} />

        <TextField fullWidth size="small" label="Message" name="message"
          value={formik.values.message} onChange={formik.handleChange}
          multiline rows={2} disabled={disabled} />

        <Box sx={{ border: '1px solid', borderColor: 'divider', p: 0.8 }}>
          <FormControlLabel
            control={<Switch checked={formik.values.aiEnabled}
              onChange={(e) => formik.setFieldValue('aiEnabled', e.target.checked)}
              size="small" disabled={disabled} />}
            label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SmartToyIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontSize: '0.78rem' }}>AI Mode</Typography>
            </Box>}
          />
          <Collapse in={formik.values.aiEnabled}>
            <TextField fullWidth size="small" label="System Prompt" name="systemPrompt"
              value={formik.values.systemPrompt} onChange={formik.handleChange}
              multiline rows={2} disabled={disabled} sx={{ mt: 0.5 }} />
          </Collapse>
        </Box>

        <Button type="submit" variant="contained" fullWidth disabled={disabled}
          startIcon={loading ? <CircularProgress size={16} /> : formik.values.aiEnabled ? <SmartToyIcon /> : <PhoneForwardedIcon />}
          sx={{ py: 0.8, fontSize: '0.8rem' }}>
          {loading ? 'Calling...' : formik.values.aiEnabled ? 'Start AI Call' : 'Make Call'}
        </Button>
      </Box>
    </form>
  );
};

export default DialerForm;
