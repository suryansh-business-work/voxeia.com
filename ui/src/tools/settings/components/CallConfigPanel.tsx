import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SettingsData } from '../settings.types';
import TwilioTab from './TwilioTab';

interface CallConfigPanelProps {
  settings: SettingsData;
  disabled: boolean;
  onSaved: () => void;
}

const CallConfigPanel = ({ settings, disabled, onSaved }: CallConfigPanelProps) => {
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(_, v) => setSubTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Twilio" sx={{ fontSize: '0.78rem', minHeight: 36, py: 0.5 }} />
      </Tabs>
      {subTab === 0 && (
        <TwilioTab config={settings.callConfig} disabled={disabled} onSaved={onSaved} />
      )}
    </Box>
  );
};

export default CallConfigPanel;
