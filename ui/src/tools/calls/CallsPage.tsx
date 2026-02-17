import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import MakeCallForm from './components/MakeCallForm';
import CallLogsCard from './components/CallLogsCard';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Calls' },
];

const CallsPage = () => {
  return (
    <Box>
      <AppBreadcrumb items={breadcrumbItems} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <MakeCallForm />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <CallLogsCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallsPage;
