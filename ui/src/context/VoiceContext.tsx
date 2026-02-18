import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getVoiceLanguageCode } from '../tools/voices/voices.data';

interface VoiceContextValue {
  voice: string;
  language: string;
  setVoice: (voiceId: string) => void;
  setLanguage: (languageCode: string) => void;
}

const VoiceContext = createContext<VoiceContextValue>({
  voice: 'Polly.Joanna-Neural',
  language: 'en-US',
  setVoice: () => {},
  setLanguage: () => {},
});

export const useVoice = () => useContext(VoiceContext);

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider = ({ children }: VoiceProviderProps) => {
  const [voice, setVoiceState] = useState('Polly.Joanna-Neural');
  const [language, setLanguage] = useState('en-US');

  const setVoice = useCallback((voiceId: string) => {
    setVoiceState(voiceId);
    setLanguage(getVoiceLanguageCode(voiceId));
  }, []);

  return (
    <VoiceContext.Provider value={{ voice, language, setVoice, setLanguage }}>
      {children}
    </VoiceContext.Provider>
  );
};

export default VoiceContext;
