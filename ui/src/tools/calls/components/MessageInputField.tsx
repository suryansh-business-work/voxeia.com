import TextField from '@mui/material/TextField';
import { FormikErrors, FormikTouched } from 'formik';
import { MakeCallFormValues } from '../calls.validation';

interface MessageInputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched: FormikTouched<MakeCallFormValues>;
  errors: FormikErrors<MakeCallFormValues>;
  disabled: boolean;
}

const MessageInputField = ({
  value,
  onChange,
  onBlur,
  touched,
  errors,
  disabled,
}: MessageInputFieldProps) => {
  return (
    <TextField
      fullWidth
      id="message"
      name="message"
      label="Message (TTS)"
      placeholder="Enter the message to speak on the call"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={touched.message && Boolean(errors.message)}
      helperText={
        (touched.message && errors.message) ||
        'This message will be spoken during the call using Text-to-Speech'
      }
      disabled={disabled}
      multiline
      rows={3}
    />
  );
};

export default MessageInputField;
