import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { makeCallValidationSchema, makeCallInitialValues, MakeCallFormValues } from '../calls.validation';
import { makeCall, makeAiCall } from '../calls.api';
import { CallResponse } from '../calls.types';
import PhoneInputField from './PhoneInputField';
import MessageInputField from './MessageInputField';
import VoiceSelector from '../../voices/VoiceSelector';
import CallResultAlert from './CallResultAlert';
import SystemPromptField from './SystemPromptField';
import LiveConversation from './LiveConversation/LiveConversation';

const MakeCallForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CallResponse | null>(null);
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [activePhoneNumber, setActivePhoneNumber] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState<string>('');

  const formik = useFormik<MakeCallFormValues>({
    initialValues: makeCallInitialValues,
    validationSchema: makeCallValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setResult(null);
      setActiveCallSid(null);
      try {
        let response: CallResponse;

        if (values.aiEnabled) {
          response = await makeAiCall({
            to: values.to,
            message: values.message || undefined,
            voice: values.voice as any,
            systemPrompt: values.systemPrompt || undefined,
          });
        } else {
          response = await makeCall({
            to: values.to,
            message: values.message || undefined,
            voice: values.voice as any,
          });
        }

        setResult(response);
        if (response.success) {
          toast.success(values.aiEnabled ? 'AI call initiated!' : 'Call initiated successfully!');
          if (values.aiEnabled && response.data?.callSid) {
            setActiveCallSid(response.data.callSid);
            setActivePhoneNumber(values.to);
            setInitialMessage(values.message || 'Hello! I am your AI assistant. How can I help you today?');
          }
        } else {
          toast.error(response.message);
        }
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Something went wrong';
        toast.error(errMsg);
        setResult({ success: false, message: errMsg });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card>
        <CardHeader
          title="Make a Call"
          subheader="Enter a phone number, select a voice, and optionally enable AI conversation"
          avatar={formik.values.aiEnabled ? <SmartToyIcon color="primary" /> : <PhoneForwardedIcon color="primary" />}
        />
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <PhoneInputField
                value={formik.values.to}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched}
                errors={formik.errors}
                disabled={loading}
              />
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <VoiceSelector
                  value={formik.values.voice}
                  onChange={(v) => formik.setFieldValue('voice', v)}
                  disabled={loading}
                />
              </Box>
              <MessageInputField
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched}
                errors={formik.errors}
                disabled={loading}
              />

              {/* AI Conversation Toggle */}
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.aiEnabled}
                      onChange={(e) => formik.setFieldValue('aiEnabled', e.target.checked)}
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SmartToyIcon fontSize="small" />
                      Enable AI Conversation (OpenAI)
                    </Box>
                  }
                />
                <Collapse in={formik.values.aiEnabled}>
                  <Box sx={{ mt: 1.5 }}>
                    <Alert severity="info" sx={{ mb: 1.5 }}>
                      AI mode keeps the call going until the caller hangs up. A public tunnel is created automatically.
                    </Alert>
                    <SystemPromptField
                      value={formik.values.systemPrompt}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      touched={formik.touched}
                      errors={formik.errors}
                      disabled={loading}
                    />
                  </Box>
                </Collapse>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : formik.values.aiEnabled ? <SmartToyIcon /> : <PhoneForwardedIcon />}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                {loading ? 'Calling...' : formik.values.aiEnabled ? 'Start AI Call' : 'Make Call'}
              </Button>
            </Box>
          </form>
          {result && (
            <CallResultAlert
              success={result.success}
              message={result.message}
              data={result.data}
            />
          )}
        </CardContent>
      </Card>

      {/* Live conversation panel */}
      {activeCallSid && (
        <LiveConversation
          callSid={activeCallSid}
          phoneNumber={activePhoneNumber}
          initialMessage={initialMessage}
          onClose={() => setActiveCallSid(null)}
        />
      )}
    </Box>
  );
};

export default MakeCallForm;
