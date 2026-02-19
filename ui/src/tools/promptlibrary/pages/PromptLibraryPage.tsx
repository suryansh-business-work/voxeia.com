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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Agent Prompt Library</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} size="small">
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
