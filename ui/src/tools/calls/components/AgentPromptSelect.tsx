import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchPrompts } from '../../promptlibrary/promptlibrary.api';
import { PromptTemplate } from '../../promptlibrary/promptlibrary.types';

interface AgentPromptSelectProps {
  value: string | null;
  onChange: (prompt: PromptTemplate | null) => void;
  disabled?: boolean;
}

const AgentPromptSelect = ({ value, onChange, disabled }: AgentPromptSelectProps) => {
  const [options, setOptions] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchPrompts({ pageSize: 100 });
        if (active && res.success) setOptions(res.data);
      } catch { /* ignore */ }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, []);

  const selected = options.find((o) => o._id === value) || null;

  return (
    <Autocomplete
      size="small"
      options={options}
      loading={loading}
      disabled={disabled}
      value={selected}
      getOptionLabel={(opt) => opt.name}
      onChange={(_, val) => onChange(val)}
      isOptionEqualToValue={(opt, val) => opt._id === val._id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Agent Prompt"
          placeholder="Choose a prompt template..."
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

export default AgentPromptSelect;
