import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import { Agent } from '../agents.types';

interface AgentCardProps {
  agent: Agent;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AgentCard = ({ agent, onSelect, onEdit, onDelete }: AgentCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <SmartToyIcon color="primary" />
          <Typography variant="h6" noWrap sx={{ flex: 1 }}>{agent.name}</Typography>
        </Box>
        <Chip label={agent.voice.replace('Polly.', '').replace('-Neural', '')} size="small" sx={{ mb: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {agent.systemPrompt}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Created {new Date(agent.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button size="small" variant="contained" startIcon={<PhoneForwardedIcon />} onClick={onSelect}>
          Use Agent
        </Button>
        <Box>
          <IconButton size="small" onClick={onEdit}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={onDelete}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default AgentCard;
