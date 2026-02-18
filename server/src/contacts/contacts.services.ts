import Contact from './contacts.models';
import Company from '../companies/companies.models';
import { CreateContactInput, UpdateContactInput, ContactListQueryInput } from './contacts.validators';

export const createContact = async (userId: string, data: CreateContactInput) => {
  const contact = new Contact({ ...data, userId });
  await contact.save();

  // Increment company contact count
  if (data.companyId) {
    await Company.findByIdAndUpdate(data.companyId, { $inc: { contactCount: 1 } });
  }

  return contact.populate('companyId', 'name');
};

export const getContacts = async (userId: string, query: ContactListQueryInput) => {
  const { page, pageSize, search, companyId, tag, sortBy, sortOrder } = query;
  const filter: Record<string, unknown> = { userId };

  if (companyId) filter.companyId = companyId;
  if (tag) filter.tags = tag;

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Contact.find(filter)
      .populate('companyId', 'name')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  return { data, pagination: { page, pageSize, total } };
};

export const getContactById = async (userId: string, contactId: string) => {
  return Contact.findOne({ _id: contactId, userId }).populate('companyId', 'name').lean();
};

export const updateContact = async (userId: string, contactId: string, data: UpdateContactInput) => {
  const existing = await Contact.findOne({ _id: contactId, userId });
  if (!existing) return null;

  // Handle company change → update counts
  if (data.companyId !== undefined && String(existing.companyId) !== String(data.companyId)) {
    if (existing.companyId) {
      await Company.findByIdAndUpdate(existing.companyId, { $inc: { contactCount: -1 } });
    }
    if (data.companyId) {
      await Company.findByIdAndUpdate(data.companyId, { $inc: { contactCount: 1 } });
    }
  }

  Object.assign(existing, data);
  await existing.save();
  return existing.populate('companyId', 'name');
};

export const deleteContact = async (userId: string, contactId: string) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (contact?.companyId) {
    await Company.findByIdAndUpdate(contact.companyId, { $inc: { contactCount: -1 } });
  }
  return contact;
};
