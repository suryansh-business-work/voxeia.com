import apiClient from '../../api/apiClient';
import { SettingsResponse, UpdateSettingsPayload } from './settings.types';

export const fetchSettings = async (): Promise<SettingsResponse> => {
  const response = await apiClient.get<SettingsResponse>('/settings');
  return response.data;
};

export const updateSettings = async (payload: UpdateSettingsPayload): Promise<SettingsResponse> => {
  const response = await apiClient.put<SettingsResponse>('/settings', payload);
  return response.data;
};
