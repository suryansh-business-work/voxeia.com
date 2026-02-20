import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import AppBreadcrumb from '../../../components/AppBreadcrumb';
import PromptLibraryTable from '../components/PromptLibraryTable';
import PromptFormDialog from '../components/PromptFormDialog';
import { PromptTemplate } from '../promptlibrary.types';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Agent Prompt Library' },
];

const PromptLibraryPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<PromptTemplate | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (item: PromptTemplate) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <Box>
      <AppBreadcrumb items={breadcrumbItems} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Prompt Library</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            Pre-built system prompts for your agents
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ px: 3 }}>
          New Prompt
        </Button>
      </Box>

      <PromptLibraryTable onEdit={handleEdit} refreshKey={refreshKey} />
      <PromptFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditItem(null); }}
        onSaved={handleSaved}
        editItem={editItem}
      />
    </Box>
  );
};

export default PromptLibraryPage;
