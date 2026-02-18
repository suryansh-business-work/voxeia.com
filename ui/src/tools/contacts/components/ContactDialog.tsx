import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { contactValidationSchema, contactInitialValues } from '../contacts.validation';
import { createContactApi, updateContactApi } from '../contacts.api';
import { Contact, Company } from '../contacts.types';

interface ContactDialogProps {
  open: boolean;
  contact: Contact | null;
  companies: Company[];
  onClose: (saved?: boolean) => void;
}

const ContactDialog = ({ open, contact, companies, onClose }: ContactDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const isEdit = !!contact;

  const formik = useFormik({
    initialValues: contact
      ? {
          firstName: contact.firstName, lastName: contact.lastName,
          email: contact.email, phone: contact.phone, jobTitle: contact.jobTitle,
          companyId: contact.companyId?._id ?? null, notes: contact.notes, tags: contact.tags,
        }
      : contactInitialValues,
    validationSchema: contactValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = { ...values, companyId: values.companyId || null };
        const res = isEdit
          ? await updateContactApi(contact!._id, payload)
          : await createContactApi(payload);
        if (res.success) {
          toast.success(isEdit ? 'Contact updated' : 'Contact created');
          onClose(true);
        } else { toast.error(res.message); }
      } catch { toast.error('Operation failed'); }
      finally { setLoading(false); }
    },
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !formik.values.tags.includes(t)) {
      formik.setFieldValue('tags', [...formik.values.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    formik.setFieldValue('tags', formik.values.tags.filter((t) => t !== tag));
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="First Name" name="firstName" required
                value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName} disabled={loading}
              />
              <TextField fullWidth label="Last Name" name="lastName"
                value={formik.values.lastName} onChange={formik.handleChange} disabled={loading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Email" name="email"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email} disabled={loading}
              />
              <TextField fullWidth label="Phone" name="phone" placeholder="+911234567890"
                value={formik.values.phone} onChange={formik.handleChange} disabled={loading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Job Title" name="jobTitle"
                value={formik.values.jobTitle} onChange={formik.handleChange} disabled={loading}
              />
              <TextField fullWidth select label="Company" name="companyId"
                value={formik.values.companyId || ''}
                onChange={(e) => formik.setFieldValue('companyId', e.target.value || null)} disabled={loading}
              >
                <MenuItem value="">No Company</MenuItem>
                {companies.map((c) => (
                  <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField fullWidth label="Notes" name="notes" multiline rows={2}
              value={formik.values.notes} onChange={formik.handleChange} disabled={loading}
            />

            {/* Tags */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small" placeholder="Add tag..." value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  disabled={loading} sx={{ flex: 1 }}
                />
                <Button size="small" variant="outlined" onClick={addTag} disabled={loading}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {formik.values.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" onDelete={() => removeTag(tag)} />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => onClose()} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : undefined}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactDialog;
