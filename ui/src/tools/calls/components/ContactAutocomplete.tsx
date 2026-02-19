import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchContacts } from '../../contacts/contacts.api';
import { Contact } from '../../contacts/contacts.types';

interface ContactAutocompleteProps {
  onSelect: (contact: Contact | null) => void;
  disabled?: boolean;
}

const ContactAutocomplete = ({ onSelect, disabled }: ContactAutocompleteProps) => {
  const [options, setOptions] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchContacts({ pageSize: 100, search: inputValue || undefined });
        if (active && res.success) setOptions(res.data);
      } catch { /* ignore */ }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [inputValue]);

  return (
    <Autocomplete
      size="small"
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName || ''} (${opt.phone})`}
      onInputChange={(_, val) => setInputValue(val)}
      onChange={(_, val) => onSelect(val)}
      isOptionEqualToValue={(opt, val) => opt._id === val._id}
      renderOption={(props, opt) => (
        <Box component="li" {...props} key={opt._id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <PersonIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {opt.firstName} {opt.lastName || ''}
            </Typography>
            <Typography variant="caption" color="text.secondary">{opt.phone}</Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Contact"
          placeholder="Search contacts..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ContactAutocomplete;
