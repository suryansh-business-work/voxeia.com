import Company from './companies.models';
import { CreateCompanyInput, UpdateCompanyInput, CompanyListQueryInput } from './companies.validators';
import { escapeRegex } from '../utils/regex';

export const createCompany = async (userId: string, data: CreateCompanyInput) => {
  const company = new Company({ ...data, userId });
  await company.save();
  return company;
};

export const getCompanies = async (userId: string, query: CompanyListQueryInput) => {
  const { page, pageSize, search, sortBy, sortOrder } = query;
  const filter: Record<string, unknown> = { userId };

  if (search) {
    const s = escapeRegex(search);
    filter.$or = [
      { name: { $regex: s, $options: 'i' } },
      { industry: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Company.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Company.countDocuments(filter),
  ]);

  return { data, pagination: { page, pageSize, total } };
};

export const getCompanyById = async (userId: string, companyId: string) => {
  return Company.findOne({ _id: companyId, userId }).lean();
};

export const updateCompany = async (userId: string, companyId: string, data: UpdateCompanyInput) => {
  return Company.findOneAndUpdate(
    { _id: companyId, userId },
    { $set: data },
    { returnDocument: 'after', runValidators: true }
  ).lean();
};

export const deleteCompany = async (userId: string, companyId: string) => {
  return Company.findOneAndDelete({ _id: companyId, userId });
};
