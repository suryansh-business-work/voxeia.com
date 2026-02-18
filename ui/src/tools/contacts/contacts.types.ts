export interface Company {
  _id: string;
  userId: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  userId: string;
  companyId: { _id: string; name: string } | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  notes: string;
  tags: string[];
  lastCalledAt: string | null;
  totalCalls: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompaniesResponse {
  success: boolean;
  data: Company[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data?: Company;
}

export interface ContactsResponse {
  success: boolean;
  data: Contact[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: Contact;
}

export interface CreateCompanyPayload {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CreateContactPayload {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string | null;
  notes?: string;
  tags?: string[];
}
