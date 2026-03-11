import React, { useRef } from 'react';
import type { FormikErrors, FormikTouched } from 'formik';
import type { StepperFormValues } from './validation';

interface StepThreeProps {
  values: StepperFormValues;
  errors: FormikErrors<StepperFormValues>;
  touched: FormikTouched<StepperFormValues>;
  setFieldValue: (field: string, value: string) => void;
}

const OtpInputGroup: React.FC<{
  label: string;
  name: 'emailOtp' | 'phoneOtp';
  value: string;
  error?: string;
  touched?: boolean;
  setFieldValue: (field: string, value: string) => void;
}> = ({ label, name, value, error, touched, setFieldValue }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleInput = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(6, ' ').split('');
    arr[idx] = digit;
    const newVal = arr.join('').replace(/\s/g, '');
    setFieldValue(name, newVal);
    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setFieldValue(name, pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#8888a0] mb-3">{label}</label>
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[idx] || ''}
            onChange={(e) => handleInput(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-xl bg-[#14141f] border border-[#2a2a3c] text-[#f0f0f5] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/50 focus:outline-none transition-colors"
          />
        ))}
      </div>
      {touched && error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
};

const StepThree: React.FC<StepThreeProps> = ({ values, errors, touched, setFieldValue }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-4">
          <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#f0f0f5] font-['Space_Grotesk']">Verify Your Identity</h3>
        <p className="text-sm text-[#8888a0] mt-1">Enter the OTP codes sent to your email and phone</p>
      </div>

      <OtpInputGroup
        label="Email OTP"
        name="emailOtp"
        value={values.emailOtp}
        error={errors.emailOtp}
        touched={touched.emailOtp}
        setFieldValue={setFieldValue}
      />

      <OtpInputGroup
        label="Phone OTP"
        name="phoneOtp"
        value={values.phoneOtp}
        error={errors.phoneOtp}
        touched={touched.phoneOtp}
        setFieldValue={setFieldValue}
      />

      <p className="text-xs text-[#5a5a72] text-center">
        Didn't receive the code?{' '}
        <button type="button" className="text-[#7c5cfc] hover:underline">
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default StepThree;
