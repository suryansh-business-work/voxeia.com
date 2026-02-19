import { createContext, useContext, useState, ReactNode } from 'react';

export interface AiModelEntry {
  id: string;
  label: string;
  tier: string;
}

export const AI_MODELS: AiModelEntry[] = [
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', tier: 'Cheap' },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', tier: 'Cheapest' },
  { id: 'gpt-4o', label: 'GPT-4o', tier: 'Medium' },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', tier: 'Expensive' },
  { id: 'gpt-4', label: 'GPT-4', tier: 'Expensive' },
  { id: 'o1-mini', label: 'O1 Mini', tier: 'Medium' },
  { id: 'o3-mini', label: 'O3 Mini', tier: 'Medium' },
];

interface ModelContextValue {
  aiModel: string;
  setAiModel: (model: string) => void;
}

const ModelContext = createContext<ModelContextValue>({
  aiModel: 'gpt-4o-mini',
  setAiModel: () => {},
});

export const useModel = () => useContext(ModelContext);

interface ModelProviderProps {
  children: ReactNode;
}

export const ModelProvider = ({ children }: ModelProviderProps) => {
  const [aiModel, setAiModel] = useState('gpt-4o-mini');

  return (
    <ModelContext.Provider value={{ aiModel, setAiModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export default ModelContext;
