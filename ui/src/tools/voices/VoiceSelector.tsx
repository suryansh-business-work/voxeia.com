import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import { ALL_VOICES, getVoiceById, VoiceProvider } from './voices.data';
import VoiceCard from './VoiceCard';

interface VoiceSelectorProps {
  value: string;
  onChange: (voiceId: string) => void;
  disabled?: boolean;
}

const VoiceSelector = ({ value, onChange, disabled }: VoiceSelectorProps) => {
  const [tab, setTab] = useState<'all' | 'feminine' | 'masculine'>('all');
  const [providerFilter, setProviderFilter] = useState<'all' | VoiceProvider>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = tab === 'all' ? ALL_VOICES : ALL_VOICES.filter((v) => v.gender === tab);
    if (providerFilter !== 'all') {
      list = list.filter((v) => v.provider === providerFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.tags.some((t) => t.includes(q)) ||
          v.gender.includes(q)
      );
    }
    return list;
  }, [tab, providerFilter, search]);

  const selectedVoice = getVoiceById(value);

  return (
    <Box sx={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      {/* Header bar */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 1, mb: 1.5,
      }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Voice Provider</Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3 }}>
            {(['all', 'sarvam', 'openai'] as const).map((p) => (
              <Chip
                key={p}
                label={p === 'all' ? 'All' : p === 'sarvam' ? 'Sarvam.ai' : 'OpenAI'}
                size="small"
                variant={providerFilter === p ? 'filled' : 'outlined'}
                color={providerFilter === p ? 'primary' : 'default'}
                onClick={() => setProviderFilter(p)}
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Selected Voice</Typography>
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {selectedVoice ? selectedVoice.name : 'None Selected'}
          </Typography>
        </Box>
      </Box>

      {/* Tabs — filter by gender */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 36, mb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab label="All" value="all" sx={{ minHeight: 36, py: 0.5 }} />
        <Tab label="Feminine" value="feminine" sx={{ minHeight: 36, py: 0.5 }} />
        <Tab label="Masculine" value="masculine" sx={{ minHeight: 36, py: 0.5 }} />
      </Tabs>

      {/* Search */}
      <TextField
        placeholder="Search voices..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
        }}
        sx={{ mb: 1.5 }}
      />

      {/* Voice grid */}
      <Box sx={{ maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
        {filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            No voices match your search.
          </Typography>
        ) : (
          <Grid container spacing={1}>
            {filtered.map((voice) => (
              <Grid item xs={12} sm={6} key={voice.id}>
                <VoiceCard voice={voice} selected={value === voice.id} onSelect={onChange} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default VoiceSelector;
