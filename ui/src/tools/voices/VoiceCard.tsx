import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { VoiceEntry } from './voices.data';

interface VoiceCardProps {
  voice: VoiceEntry;
  selected: boolean;
  onSelect: (id: string) => void;
}

const VoiceCard = ({ voice, selected, onSelect }: VoiceCardProps) => {
  const [playing, setPlaying] = useState(false);

  const handlePlaySample = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`Hello, I am ${voice.name}. How can I help you today?`);
    utterance.rate = 0.9;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  return (
    <Box
      onClick={() => onSelect(voice.id)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? (t) => alpha(t.palette.primary.main, 0.06) : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s',
        '&:hover': { borderColor: 'primary.dark', bgcolor: (t) => alpha(t.palette.primary.main, 0.03) },
      }}
    >
      <Radio checked={selected} size="small" sx={{ p: 0.3, mt: 0.2 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" fontWeight={600} color="text.primary">{voice.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            {voice.provider === 'amazon' ? 'Polly' : 'Google'}
          </Typography>
          <IconButton
            size="small"
            onClick={handlePlaySample}
            sx={{ ml: 'auto', color: playing ? 'error.main' : 'primary.main', p: 0.3 }}
          >
            {playing ? <StopIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={voice.gender}
            size="small"
            variant="outlined"
            sx={{
              height: 20, fontSize: '0.65rem',
              borderColor: voice.gender === 'feminine' ? '#EC4899' : '#3B82F6',
              color: voice.gender === 'feminine' ? '#EC4899' : '#3B82F6',
            }}
          />
          {voice.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
          ))}
          {voice.languages.map((lang) => (
            <Chip key={lang} label={lang} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(0,191,166,0.12)', color: 'primary.main' }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default VoiceCard;
