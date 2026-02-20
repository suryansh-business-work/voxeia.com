import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { TtsConfig } from '../settings.types';
import { updateSettings } from '../settings.api';

interface SarvamTabProps {
  config: TtsConfig;
  disabled: boolean;
  onSaved: () => void;
}

const validationSchema = Yup.object().shape({
  sarvamApiKey: Yup.string().max(200, 'Max 200 characters'),
});

const SarvamTab = ({ config, disabled, onSaved }: SarvamTabProps) => {
  const [showKey, setShowKey] = useState(false);

  const formik = useFormik({
    initialValues: {
      sarvamApiKey: config.sarvamApiKey || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateSettings({ ttsConfig: values });
        toast.success('Sarvam API configuration saved');
        onSaved();
      } catch {
        toast.error('Failed to save Sarvam API configuration');
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Configure your Sarvam.ai API key for Text-to-Speech services.
      </Typography>
      <TextField
        fullWidth
        label="API Key"
        name="sarvamApiKey"
        placeholder="Enter your Sarvam.ai API key"
        type={showKey ? 'text' : 'password'}
        value={formik.values.sarvamApiKey}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.sarvamApiKey && Boolean(formik.errors.sarvamApiKey)}
        helperText={formik.touched.sarvamApiKey && formik.errors.sarvamApiKey}
        disabled={disabled}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowKey((v) => !v)} edge="end">
                  {showKey ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button
          type="submit"
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          disabled={disabled || formik.isSubmitting}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SarvamTab;
