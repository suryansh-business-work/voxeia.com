import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SUPPORTED_LANGUAGES } from '../../voices/voices.data';

interface LanguageSelectProps {
  value: string;
  onChange: (languageCode: string) => void;
  disabled?: boolean;
}

const LanguageSelect = ({ value, onChange, disabled }: LanguageSelectProps) => {
  return (
    <TextField
      select
      fullWidth
      size="small"
      label="Language"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      helperText="Speech recognition & TTS language"
      SelectProps={{ displayEmpty: true }}
    >
      <MenuItem value="" disabled>
        <Typography variant="body2" color="text.secondary">Select Language</Typography>
      </MenuItem>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <MenuItem key={lang.code} value={lang.code}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" component="span">{lang.flag}</Typography>
            <Typography variant="body2" component="span">{lang.label}</Typography>
          </Box>
        </MenuItem>
      ))}
    </TextField>
  );
};

export default LanguageSelect;
