import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import toast from 'react-hot-toast';
import { generatePromptApi } from '../promptlibrary.api';

interface AiPromptGeneratorProps {
  language: string;
  onGenerated: (data: { name: string; systemPrompt: string; description: string }) => void;
}

const AiPromptGenerator = ({ language, onGenerated }: AiPromptGeneratorProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please describe the agent you want');
      return;
    }
    setLoading(true);
    try {
      const res = await generatePromptApi(input.trim(), language);
      if (res.success && res.data) {
        onGenerated(res.data);
        setInput('');
        toast.success('Prompt generated!');
      } else {
        toast.error('Failed to generate prompt');
      }
    } catch {
      toast.error('Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ border: '1px dashed', borderColor: 'primary.main', borderRadius: 1, p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <AutoAwesomeIcon color="primary" fontSize="small" />
        <Typography variant="body2" fontWeight={600} color="primary">
          AI Prompt Generator
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Describe the agent you want and AI will generate a professional system prompt.
      </Typography>
      <TextField
        fullWidth
        size="small"
        multiline
        rows={2}
        placeholder='e.g. "A travel agent that helps people plan trips and book hotels"'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        sx={{ mb: 1 }}
      />
      <Button
        variant="contained"
        size="small"
        startIcon={loading ? <CircularProgress size={14} /> : <AutoAwesomeIcon />}
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
      >
        {loading ? 'Generating...' : 'Generate with AI'}
      </Button>
    </Box>
  );
};

export default AiPromptGenerator;
