import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import CallIcon from '@mui/icons-material/Call';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BadgeIcon from '@mui/icons-material/Badge';
import { alpha } from '@mui/material/styles';
import { Contact } from '../contacts.types';

interface ContactInfoCardProps {
  contact: Contact;
  pendingScheduledCount: number;
  onSendEmail?: () => void;
  onScheduleCall?: () => void;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8 }}>
    <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.03em' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const ContactInfoCard = ({ contact, pendingScheduledCount, onSendEmail, onScheduleCall }: ContactInfoCardProps) => {
  const navigate = useNavigate();
  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  const initials = `${contact.firstName?.[0] || ''}${contact.lastName?.[0] || ''}`.toUpperCase();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Avatar + Identity */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 72, height: 72, fontSize: '1.5rem', fontWeight: 700,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
              color: 'primary.main', mb: 0.5,
            }}
          >
            {initials}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3 }}>{fullName}</Typography>
          {contact.jobTitle && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>{contact.jobTitle}</Typography>
          )}
          {contact.companyId && typeof contact.companyId === 'object' && (
            <Chip
              icon={<WorkIcon sx={{ fontSize: '14px !important' }} />}
              label={contact.companyId.name}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Call Now">
            <Button
              variant="contained" size="small"
              startIcon={<CallIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate(`/call?phone=${encodeURIComponent(contact.phone)}`)}
              sx={{ fontSize: '0.72rem', textTransform: 'none', px: 1.5 }}
            >
              Call
            </Button>
          </Tooltip>
          {contact.email && onSendEmail && (
            <Tooltip title="Send Email">
              <Button
                variant="outlined" size="small" color="secondary"
                startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
                onClick={onSendEmail}
                sx={{ fontSize: '0.72rem', textTransform: 'none', px: 1.5 }}
              >
                Email
              </Button>
            </Tooltip>
          )}
          {onScheduleCall && (
            <Tooltip title="Schedule Call">
              <Button
                variant="outlined" size="small"
                startIcon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                onClick={onScheduleCall}
                sx={{ fontSize: '0.72rem', textTransform: 'none', px: 1.5 }}
              >
                Schedule
              </Button>
            </Tooltip>
          )}
        </Box>

        <Divider />

        {/* Contact Details */}
        <Box>
          <Typography variant="overline" sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary' }}>
            Contact Details
          </Typography>
          <InfoRow icon={<PhoneIcon sx={{ fontSize: 16 }} />} label="Phone" value={contact.phone || 'Not provided'} />
          <InfoRow icon={<EmailIcon sx={{ fontSize: 16 }} />} label="Email" value={contact.email || 'Not provided'} />
          <InfoRow icon={<BadgeIcon sx={{ fontSize: 16 }} />} label="Job Title" value={contact.jobTitle || 'Not provided'} />
          <InfoRow
            icon={<WorkIcon sx={{ fontSize: 16 }} />}
            label="Company"
            value={contact.companyId && typeof contact.companyId === 'object' ? contact.companyId.name : 'No company'}
          />
        </Box>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="overline" sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary' }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                {contact.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.68rem' }} />
                ))}
              </Box>
            </Box>
          </>
        )}

        {/* Notes */}
        {contact.notes && (
          <>
            <Divider />
            <Box>
              <Typography variant="overline" sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary' }}>
                Notes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>
                {contact.notes}
              </Typography>
            </Box>
          </>
        )}

        <Divider />

        {/* Quick Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {[
            { label: 'Total Calls', value: String(contact.totalCalls) },
            { label: 'Scheduled', value: `${pendingScheduledCount} pending` },
            { label: 'Last Called', value: contact.lastCalledAt ? formatDate(contact.lastCalledAt) : 'Never' },
            { label: 'Created', value: formatDate(contact.createdAt) },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                p: 1, borderRadius: 1, bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                border: '1px solid', borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>
                {stat.label}
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>{stat.value}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
