import apiClient from '../../api/apiClient';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: AuthUser;
}

export const signupApi = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', { name, email, password });
  return response.data;
};

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordApi = async (token: string, password: string) => {
  const response = await apiClient.post('/auth/reset-password', { token, password });
  return response.data;
};

export const getProfileApi = async (): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>('/auth/profile');
  return response.data;
};

export const updateProfileApi = async (data: { name?: string }): Promise<ProfileResponse> => {
  const response = await apiClient.put<ProfileResponse>('/auth/profile', data);
  return response.data;
};

export const uploadProfilePhotoApi = async (file: File): Promise<ProfileResponse> => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await apiClient.post<ProfileResponse>('/auth/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
