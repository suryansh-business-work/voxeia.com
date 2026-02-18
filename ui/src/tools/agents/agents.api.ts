import apiClient from '../../api/apiClient';
import { AgentsResponse, AgentResponse, CreateAgentPayload, UpdateAgentPayload } from './agents.types';

export const fetchAgents = async (params?: { page?: number; pageSize?: number; search?: string }): Promise<AgentsResponse> => {
  const response = await apiClient.get<AgentsResponse>('/agents', { params });
  return response.data;
};

export const fetchAgentById = async (agentId: string): Promise<AgentResponse> => {
  const response = await apiClient.get<AgentResponse>(`/agents/${agentId}`);
  return response.data;
};

export const createAgentApi = async (data: CreateAgentPayload): Promise<AgentResponse> => {
  const response = await apiClient.post<AgentResponse>('/agents', data);
  return response.data;
};

export const updateAgentApi = async (agentId: string, data: UpdateAgentPayload): Promise<AgentResponse> => {
  const response = await apiClient.put<AgentResponse>(`/agents/${agentId}`, data);
  return response.data;
};

export const deleteAgentApi = async (agentId: string) => {
  const response = await apiClient.delete(`/agents/${agentId}`);
  return response.data;
};

export const uploadAgentPhotoApi = async (agentId: string, file: File): Promise<{ success: boolean; message: string; data?: { image: string } }> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiClient.post(`/agents/${agentId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
