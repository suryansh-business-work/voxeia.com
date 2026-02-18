import * as Yup from 'yup';

export const createAgentValidationSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').max(100).required('Agent name is required'),
  systemPrompt: Yup.string().min(10, 'System prompt must be at least 10 characters').max(5000).required('System prompt is required'),
  voice: Yup.string().required('Voice is required'),
  greeting: Yup.string().max(500).notRequired(),
});

export interface CreateAgentFormValues {
  name: string;
  systemPrompt: string;
  voice: string;
  greeting: string;
}

export const createAgentInitialValues: CreateAgentFormValues = {
  name: '',
  systemPrompt: 'You are a helpful, friendly AI phone assistant. Keep your responses concise and conversational.',
  voice: 'Polly.Joanna-Neural',
  greeting: 'Hello! I am your AI assistant. How can I help you today?',
};
