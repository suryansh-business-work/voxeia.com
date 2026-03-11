import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import StepIndicator from './StepIndicator';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { StepOneSchema, StepTwoSchema, StepThreeSchema, initialValues } from './validation';
import type { StepperFormValues } from './validation';

const API_BASE = 'https://api.voxeia.com';
const schemas = [StepOneSchema, StepTwoSchema, StepThreeSchema];

const HeroStepperForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLastStep = step === 3;

  const sendDemoEmail = async (values: StepperFormValues) => {
    try {
      await fetch(`${API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'contact@voxeia.com',
          subject: `Demo Request from ${values.name}`,
          body: `New demo request:\n\nName: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\nCallback requested: ${values.wantCallback ? 'Yes' : 'No'}`,
        }),
      });
    } catch {
      // Email send is best-effort, don't block the flow
    }
  };

  const initiateStreamingCall = async (values: StepperFormValues) => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/stream/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: values.phone,
          message: `Hello ${values.name}! This is Voxeia AI calling you for a quick demo. How can I help you today?`,
          voice: 'meera',
          language: 'en-IN',
        }),
      });
      const data = await res.json();
      if (!data.success) {
        console.warn('Streaming call failed:', data.message);
      }
    } catch (err) {
      console.warn('Could not initiate demo call:', err);
    }
  };

  const handleSubmit = async (values: StepperFormValues) => {
    setError('');
    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);
    try {
      // Send demo email notification
      await sendDemoEmail(values);

      // Initiate streaming AI demo call
      await initiateStreamingCall(values);

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#f0f0f5] font-['Space_Grotesk']">You're all set!</h3>
        <p className="text-sm text-[#8888a0] mt-2">
          Our AI agent will call you shortly at your number. Get ready to experience the future of voice AI.
        </p>
      </div>
    );
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schemas[step - 1]} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form noValidate>
          <StepIndicator currentStep={step} totalSteps={3} />

          {step === 1 && <StepOne values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />}
          {step === 2 && (
            <StepTwo
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          )}
          {step === 3 && <StepThree values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />}

          <div className="flex gap-3 mt-8">
            {error && <p className="text-red-400 text-xs mb-2 text-center w-full">{error}</p>}
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-[#8888a0] bg-[#14141f] border border-[#2a2a3c] rounded-xl hover:border-[#7c5cfc]/30 hover:text-[#f0f0f5] transition-all"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#7c5cfc] to-[#6344e0] rounded-xl hover:shadow-lg hover:shadow-[#7c5cfc]/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : isLastStep ? 'Verify & Get Called' : 'Continue'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default HeroStepperForm;
