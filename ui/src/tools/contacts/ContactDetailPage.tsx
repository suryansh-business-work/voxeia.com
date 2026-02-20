import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import HistoryIcon from '@mui/icons-material/History';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/Email';
import toast from 'react-hot-toast';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import { fetchContactById } from './contacts.api';
import { Contact } from './contacts.types';
import { fetchScheduledCallsByContact } from '../scheduler/scheduler.api';
import { ScheduledCall } from '../scheduler/scheduler.types';
import CreateScheduleDialog from '../scheduler/components/CreateScheduleDialog';
import ContactInfoCard from './components/ContactInfoCard';
import CallHistoryTab from './components/CallHistoryTab';
import ScheduledCallsTab from './components/ScheduledCallsTab';
import EmailComposerDialog from './components/EmailComposerDialog';

const ContactDetailPage = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [scheduled, setScheduled] = useState<ScheduledCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const load = useCallback(async () => {
    if (!contactId) return;
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        fetchContactById(contactId),
        fetchScheduledCallsByContact(contactId),
      ]);
      if (cRes.success && cRes.data) setContact(cRes.data);
      if (sRes.success) setScheduled(sRes.data);
    } catch { toast.error('Failed to load contact'); }
    finally { setLoading(false); }
  }, [contactId]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  if (!contact) {
    return <Typography color="error" sx={{ py: 4 }}>Contact not found</Typography>;
  }

  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  const pendingCount = scheduled.filter((s) => s.status === 'pending' || s.status === 'manual_required').length;

  return (
    <Box>
      <AppBreadcrumb items={[{ label: 'Contacts', href: '/contacts' }, { label: fullName }]} />

      {/* CRM two-column layout */}
      <Grid container spacing={2}>
        {/* Left Sidebar — Contact Info */}
        <Grid item xs={12} md={4} lg={3}>
          <ContactInfoCard
            contact={contact}
            pendingScheduledCount={pendingCount}
            onSendEmail={contact.email ? () => setEmailDialogOpen(true) : undefined}
            onScheduleCall={() => setScheduleDialogOpen(true)}
          />
        </Grid>

        {/* Right Content — Tabs */}
        <Grid item xs={12} md={8} lg={9}>
          <Card>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab
                icon={<HistoryIcon sx={{ fontSize: 16 }} />}
                iconPosition="start"
                label="Call History"
                sx={{ textTransform: 'none', minHeight: 48, fontSize: '0.82rem' }}
              />
              <Tab
                icon={
                  <Badge badgeContent={pendingCount} color="warning" max={99}>
                    <ScheduleIcon sx={{ fontSize: 16 }} />
                  </Badge>
                }
                iconPosition="start"
                label="Scheduled Calls"
                sx={{ textTransform: 'none', minHeight: 48, fontSize: '0.82rem' }}
              />
              {contact.email && (
                <Tab
                  icon={<EmailIcon sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label="Email"
                  sx={{ textTransform: 'none', minHeight: 48, fontSize: '0.82rem' }}
                />
              )}
            </Tabs>
            <Box sx={{ p: 2 }}>
              {tab === 0 && <CallHistoryTab phone={contact.phone} />}
              {tab === 1 && (
                <ScheduledCallsTab
                  scheduled={scheduled}
                  onRefresh={load}
                  onOpenDialog={() => setScheduleDialogOpen(true)}
                />
              )}
              {tab === 2 && contact.email && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EmailIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Email integration — compose and send emails directly.
                  </Typography>
                  <Box>
                    <button
                      onClick={() => setEmailDialogOpen(true)}
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
                        Compose New Email
                      </Typography>
                    </button>
                  </Box>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <CreateScheduleDialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        onCreated={() => { setScheduleDialogOpen(false); load(); }}
        prefillContactId={contactId}
      />

      <EmailComposerDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        prefillTo={contact.email}
        contactName={fullName}
      />
    </Box>
  );
};

export default ContactDetailPage;
