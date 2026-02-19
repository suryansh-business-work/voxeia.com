import apiClient from '../../api/apiClient';
import {
  PromptsResponse,
  PromptResponse,
  CreatePromptPayload,
  UpdatePromptPayload,
  GeneratePromptResponse,
} from './promptlibrary.types';

export const fetchPrompts = async (params?: Record<string, unknown>): Promise<PromptsResponse> => {
  const res = await apiClient.get<PromptsResponse>('/prompts', { params });
  return res.data;
};

export const fetchPromptById = async (id: string): Promise<PromptResponse> => {
  const res = await apiClient.get<PromptResponse>(`/prompts/${id}`);
  return res.data;
};

export const createPromptApi = async (data: CreatePromptPayload): Promise<PromptResponse> => {
  const res = await apiClient.post<PromptResponse>('/prompts', data);
  return res.data;
};

export const updatePromptApi = async (id: string, data: UpdatePromptPayload): Promise<PromptResponse> => {
  const res = await apiClient.put<PromptResponse>(`/prompts/${id}`, data);
  return res.data;
};

export const deletePromptApi = async (id: string) => {
  const res = await apiClient.delete(`/prompts/${id}`);
  return res.data;
};

export const generatePromptApi = async (
  description: string,
  language: string = 'en-IN'
): Promise<GeneratePromptResponse> => {
  const res = await apiClient.post<GeneratePromptResponse>('/prompts/generate', {
    description,
    language,
  });
  return res.data;
};
