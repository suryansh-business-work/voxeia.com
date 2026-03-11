import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { FormikErrors, FormikTouched } from 'formik';
import type { StepperFormValues } from './validation';

interface StepOneProps {
  values: StepperFormValues;
  errors: FormikErrors<StepperFormValues>;
  touched: FormikTouched<StepperFormValues>;
  setFieldValue: (field: string, value: string) => void;
}

const StepOne: React.FC<StepOneProps> = ({ values, errors, touched, setFieldValue }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7c5cfc]/20 to-[#00d4ff]/20 mb-4">
          <svg className="w-7 h-7 text-[#7c5cfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#f0f0f5] font-['Space_Grotesk']">
          Have one of our AI agents give you a call now
        </h3>
        <p className="text-sm text-[#8888a0] mt-2">Enter your phone number and experience Voxeia in action</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8888a0] mb-2">Phone Number</label>
        <PhoneInput
          international
          defaultCountry="IN"
          value={values.phone}
          onChange={(val) => setFieldValue('phone', val || '')}
          className="w-full px-4 py-3 rounded-xl bg-[#14141f] border border-[#2a2a3c] text-[#f0f0f5] focus-within:border-[#7c5cfc]/50 focus-within:ring-1 focus-within:ring-[#7c5cfc]/50 transition-colors"
        />
        {touched.phone && errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
      </div>
    </div>
  );
};

export default StepOne;
