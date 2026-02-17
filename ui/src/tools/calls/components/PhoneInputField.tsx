import TextField from '@mui/material/TextField';
import { FormikErrors, FormikTouched } from 'formik';
import { MakeCallFormValues } from '../calls.validation';

interface PhoneInputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched: FormikTouched<MakeCallFormValues>;
  errors: FormikErrors<MakeCallFormValues>;
  disabled: boolean;
}

const PhoneInputField = ({
  value,
  onChange,
  onBlur,
  touched,
  errors,
  disabled,
}: PhoneInputFieldProps) => {
  return (
    <TextField
      fullWidth
      id="to"
      name="to"
      label="Phone Number"
      placeholder="+911234567890"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={touched.to && Boolean(errors.to)}
      helperText={
        (touched.to && errors.to) ||
        'Enter phone number in E.164 format (e.g., +911234567890)'
      }
      disabled={disabled}
      required
    />
  );
};

export default PhoneInputField;
