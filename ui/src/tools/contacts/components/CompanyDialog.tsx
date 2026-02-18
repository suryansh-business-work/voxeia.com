import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { companyValidationSchema, companyInitialValues } from '../contacts.validation';
import { createCompanyApi, updateCompanyApi } from '../contacts.api';
import { Company } from '../contacts.types';

interface CompanyDialogProps {
  open: boolean;
  company: Company | null;
  onClose: (saved?: boolean) => void;
}

const CompanyDialog = ({ open, company, onClose }: CompanyDialogProps) => {
  const [loading, setLoading] = useState(false);
  const isEdit = !!company;

  const formik = useFormik({
    initialValues: company
      ? { name: company.name, industry: company.industry, website: company.website, phone: company.phone, email: company.email, address: company.address, notes: company.notes }
      : companyInitialValues,
    validationSchema: companyValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = isEdit
          ? await updateCompanyApi(company!._id, values)
          : await createCompanyApi(values);
        if (res.success) {
          toast.success(isEdit ? 'Company updated' : 'Company created');
          onClose(true);
        } else { toast.error(res.message); }
      } catch { toast.error('Operation failed'); }
      finally { setLoading(false); }
    },
  });

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Company' : 'Add Company'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Company Name" name="name" required
              value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name} disabled={loading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Industry" name="industry"
                value={formik.values.industry} onChange={formik.handleChange} disabled={loading}
              />
              <TextField fullWidth label="Website" name="website" placeholder="https://"
                value={formik.values.website} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website} disabled={loading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Phone" name="phone"
                value={formik.values.phone} onChange={formik.handleChange} disabled={loading}
              />
              <TextField fullWidth label="Email" name="email"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email} disabled={loading}
              />
            </Box>
            <TextField fullWidth label="Address" name="address"
              value={formik.values.address} onChange={formik.handleChange} disabled={loading}
            />
            <TextField fullWidth label="Notes" name="notes" multiline rows={2}
              value={formik.values.notes} onChange={formik.handleChange} disabled={loading}
            />
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

export default CompanyDialog;
