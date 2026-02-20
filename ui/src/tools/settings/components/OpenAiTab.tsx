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
import { AiConfig } from '../settings.types';
import { updateSettings } from '../settings.api';

interface OpenAiTabProps {
  config: AiConfig;
  disabled: boolean;
  onSaved: () => void;
}

const validationSchema = Yup.object().shape({
  openaiApiKey: Yup.string().max(200, 'Max 200 characters'),
});

const OpenAiTab = ({ config, disabled, onSaved }: OpenAiTabProps) => {
  const [showKey, setShowKey] = useState(false);

  const formik = useFormik({
    initialValues: {
      openaiApiKey: config.openaiApiKey || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateSettings({ aiConfig: values });
        toast.success('OpenAI configuration saved');
        onSaved();
      } catch {
        toast.error('Failed to save OpenAI configuration');
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Configure your OpenAI API key for AI-powered conversations.
      </Typography>
      <TextField
        fullWidth
        label="API Key"
        name="openaiApiKey"
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        type={showKey ? 'text' : 'password'}
        value={formik.values.openaiApiKey}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.openaiApiKey && Boolean(formik.errors.openaiApiKey)}
        helperText={formik.touched.openaiApiKey && formik.errors.openaiApiKey}
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

export default OpenAiTab;
