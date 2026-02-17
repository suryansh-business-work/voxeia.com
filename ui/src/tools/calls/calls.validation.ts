import * as Yup from 'yup';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const makeCallValidationSchema = Yup.object().shape({
  to: Yup.string()
    .required('Phone number is required')
    .matches(phoneRegex, 'Phone number must be in E.164 format (e.g., +911234567890)'),
  message: Yup.string()
    .max(500, 'Message must be under 500 characters')
    .notRequired(),
});

export interface MakeCallFormValues {
  to: string;
  message: string;
}

export const makeCallInitialValues: MakeCallFormValues = {
  to: '',
  message: 'Hello! This is a call from Twilio Call Bot.',
};
