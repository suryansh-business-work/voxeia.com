import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { FormikErrors, FormikTouched } from 'formik';
import { MakeCallFormValues } from '../calls.validation';

interface SystemPromptFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  touched: FormikTouched<MakeCallFormValues>;
  errors: FormikErrors<MakeCallFormValues>;
  disabled: boolean;
}

const SystemPromptField = ({ value, onChange, onBlur, touched, errors, disabled }: SystemPromptFieldProps) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <SmartToyIcon fontSize="small" color="primary" />
        <Typography variant="caption" fontWeight={600} color="primary">
          AI System Prompt (Pre-prompt)
        </Typography>
      </Box>
      <TextField
        fullWidth
        name="systemPrompt"
        placeholder="Define how the AI should behave during the call..."
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.systemPrompt && Boolean(errors.systemPrompt)}
        helperText={(touched.systemPrompt && errors.systemPrompt) || 'This defines the AI personality and behavior for the conversation'}
        disabled={disabled}
        multiline
        minRows={2}
        maxRows={4}
        size="small"
        inputProps={{ maxLength: 2000 }}
      />
    </Box>
  );
};

export default SystemPromptField;
