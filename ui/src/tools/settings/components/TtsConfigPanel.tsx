import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SettingsData } from '../settings.types';
import SarvamTab from './SarvamTab';

interface TtsConfigPanelProps {
  settings: SettingsData;
  disabled: boolean;
  onSaved: () => void;
}

const TtsConfigPanel = ({ settings, disabled, onSaved }: TtsConfigPanelProps) => {
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(_, v) => setSubTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Sarvam API" sx={{ fontSize: '0.78rem', minHeight: 36, py: 0.5 }} />
      </Tabs>
      {subTab === 0 && (
        <SarvamTab config={settings.ttsConfig} disabled={disabled} onSaved={onSaved} />
      )}
    </Box>
  );
};

export default TtsConfigPanel;
