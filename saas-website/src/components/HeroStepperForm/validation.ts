import * as Yup from 'yup';

export const StepOneSchema = Yup.object({
  phone: Yup.string().required('Phone number is required').min(8, 'Enter a valid phone number'),
});

export const StepTwoSchema = Yup.object({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  acceptPolicy: Yup.boolean().oneOf([true], 'You must accept the privacy policy'),
  acceptSignup: Yup.boolean().oneOf([true], 'You must confirm signup'),
  wantCallback: Yup.boolean(),
});

export const StepThreeSchema = Yup.object({
  emailOtp: Yup.string().required('Email OTP is required').length(6, 'OTP must be 6 digits'),
  phoneOtp: Yup.string().required('Phone OTP is required').length(6, 'OTP must be 6 digits'),
});

export interface StepperFormValues {
  phone: string;
  name: string;
  email: string;
  acceptPolicy: boolean;
  acceptSignup: boolean;
  wantCallback: boolean;
  emailOtp: string;
  phoneOtp: string;
}

export const initialValues: StepperFormValues = {
  phone: '',
  name: '',
  email: '',
  acceptPolicy: false,
  acceptSignup: false,
  wantCallback: false,
  emailOtp: '345678',
  phoneOtp: '345678',
};
