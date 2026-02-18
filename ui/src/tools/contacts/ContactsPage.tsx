import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import CompaniesTab from './components/CompaniesTab';
import ContactsTab from './components/ContactsTab';

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Contacts' },
];

const ContactsPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <AppBreadcrumb items={breadcrumbItems} />
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Contacts" />
            <Tab icon={<BusinessIcon />} iconPosition="start" label="Companies" />
          </Tabs>

          {tab === 0 && <ContactsTab />}
          {tab === 1 && <CompaniesTab />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactsPage;
