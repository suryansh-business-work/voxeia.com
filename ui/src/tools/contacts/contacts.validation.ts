import * as Yup from 'yup';

export const companyValidationSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Required').max(200).required('Company name is required'),
  industry: Yup.string().max(100).notRequired(),
  website: Yup.string().url('Must be a valid URL').notRequired(),
  phone: Yup.string().max(20).notRequired(),
  email: Yup.string().email('Must be a valid email').notRequired(),
  address: Yup.string().max(500).notRequired(),
  notes: Yup.string().max(2000).notRequired(),
});

export const companyInitialValues = {
  name: '',
  industry: '',
  website: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
};

export const contactValidationSchema = Yup.object().shape({
  firstName: Yup.string().min(1, 'Required').max(100).required('First name is required'),
  lastName: Yup.string().max(100).notRequired(),
  email: Yup.string().email('Must be a valid email').notRequired(),
  phone: Yup.string().max(20).notRequired(),
  jobTitle: Yup.string().max(100).notRequired(),
  companyId: Yup.string().nullable().notRequired(),
  notes: Yup.string().max(2000).notRequired(),
  tags: Yup.array().of(Yup.string().max(50).required()).max(20).notRequired(),
});

export const contactInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobTitle: '',
  companyId: '' as string | null,
  notes: '',
  tags: [] as string[],
};
