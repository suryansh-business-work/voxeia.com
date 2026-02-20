import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SettingsData } from '../settings.types';
import OpenAiTab from './OpenAiTab';

interface AiConfigPanelProps {
  settings: SettingsData;
  disabled: boolean;
  onSaved: () => void;
}

const AiConfigPanel = ({ settings, disabled, onSaved }: AiConfigPanelProps) => {
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(_, v) => setSubTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="OpenAI" sx={{ fontSize: '0.78rem', minHeight: 36, py: 0.5 }} />
      </Tabs>
      {subTab === 0 && (
        <OpenAiTab config={settings.aiConfig} disabled={disabled} onSaved={onSaved} />
      )}
    </Box>
  );
};

export default AiConfigPanel;
