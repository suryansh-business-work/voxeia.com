import apiClient from '../../api/apiClient';
import {
  CompaniesResponse, CompanyResponse, CreateCompanyPayload,
  ContactsResponse, ContactResponse, CreateContactPayload,
} from './contacts.types';

/* ─── Companies ────────────────────────────────────────────────── */
export const fetchCompanies = async (params?: Record<string, unknown>): Promise<CompaniesResponse> => {
  const res = await apiClient.get<CompaniesResponse>('/companies', { params });
  return res.data;
};

export const fetchCompanyById = async (id: string): Promise<CompanyResponse> => {
  const res = await apiClient.get<CompanyResponse>(`/companies/${id}`);
  return res.data;
};

export const createCompanyApi = async (data: CreateCompanyPayload): Promise<CompanyResponse> => {
  const res = await apiClient.post<CompanyResponse>('/companies', data);
  return res.data;
};

export const updateCompanyApi = async (id: string, data: Partial<CreateCompanyPayload>): Promise<CompanyResponse> => {
  const res = await apiClient.put<CompanyResponse>(`/companies/${id}`, data);
  return res.data;
};

export const deleteCompanyApi = async (id: string) => {
  const res = await apiClient.delete(`/companies/${id}`);
  return res.data;
};

/* ─── Contacts ─────────────────────────────────────────────────── */
export const fetchContacts = async (params?: Record<string, unknown>): Promise<ContactsResponse> => {
  const res = await apiClient.get<ContactsResponse>('/contacts', { params });
  return res.data;
};

export const fetchContactById = async (id: string): Promise<ContactResponse> => {
  const res = await apiClient.get<ContactResponse>(`/contacts/${id}`);
  return res.data;
};

export const createContactApi = async (data: CreateContactPayload): Promise<ContactResponse> => {
  const res = await apiClient.post<ContactResponse>('/contacts', data);
  return res.data;
};

export const updateContactApi = async (id: string, data: Partial<CreateContactPayload>): Promise<ContactResponse> => {
  const res = await apiClient.put<ContactResponse>(`/contacts/${id}`, data);
  return res.data;
};

export const deleteContactApi = async (id: string) => {
  const res = await apiClient.delete(`/contacts/${id}`);
  return res.data;
};
