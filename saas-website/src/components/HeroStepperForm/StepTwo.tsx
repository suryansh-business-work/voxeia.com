import React from 'react';
import type { FormikErrors, FormikTouched } from 'formik';
import type { StepperFormValues } from './validation';

interface StepTwoProps {
  values: StepperFormValues;
  errors: FormikErrors<StepperFormValues>;
  touched: FormikTouched<StepperFormValues>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#132d45] border border-[#234c6a] text-[#e8f1f8] placeholder-[#4a708d] focus:border-[#3fe3cd]/50 focus:ring-1 focus:ring-[#3fe3cd]/50 focus:outline-none transition-colors text-sm';

const StepTwo: React.FC<StepTwoProps> = ({ values, errors, touched, handleChange, handleBlur }) => {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#7a9bb5] mb-2">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClass}
        />
        {touched.name && errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#7a9bb5] mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@company.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClass}
        />
        {touched.email && errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="acceptPolicy"
            checked={values.acceptPolicy}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded border-[#234c6a] bg-[#132d45] text-[#3fe3cd] focus:ring-[#3fe3cd]/50 focus:ring-offset-0"
          />
          <span className="text-sm text-[#7a9bb5] group-hover:text-[#e8f1f8] transition-colors">
            I accept the{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3fe3cd] hover:underline"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#3fe3cd] hover:underline">
              Terms of Service
            </a>
            <span className="text-red-400 ml-0.5">*</span>
          </span>
        </label>
        {touched.acceptPolicy && errors.acceptPolicy && (
          <p className="text-red-400 text-xs ml-7">{errors.acceptPolicy}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="acceptSignup"
            checked={values.acceptSignup}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded border-[#234c6a] bg-[#132d45] text-[#3fe3cd] focus:ring-[#3fe3cd]/50 focus:ring-offset-0"
          />
          <span className="text-sm text-[#7a9bb5] group-hover:text-[#e8f1f8] transition-colors">
            I confirm my signup and consent to receive communications
            <span className="text-red-400 ml-0.5">*</span>
          </span>
        </label>
        {touched.acceptSignup && errors.acceptSignup && (
          <p className="text-red-400 text-xs ml-7">{errors.acceptSignup}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="wantCallback"
            checked={values.wantCallback}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded border-[#234c6a] bg-[#132d45] text-[#3fe3cd] focus:ring-[#3fe3cd]/50 focus:ring-offset-0"
          />
          <span className="text-sm text-[#7a9bb5] group-hover:text-[#e8f1f8] transition-colors">
            I'd like a representative to call me <span className="text-[#4a708d]">(optional)</span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default StepTwo;
