import Agent, { IAgent } from './agents.models';
import { CreateAgentInput, UpdateAgentInput, AgentListQueryInput } from './agents.validators';

export const createAgent = async (userId: string, data: CreateAgentInput): Promise<IAgent> => {
  const agent = await Agent.create({ userId, ...data });
  return agent;
};

export const getAgents = async (
  userId: string,
  query: AgentListQueryInput
): Promise<{ agents: IAgent[]; total: number }> => {
  const { page = 1, pageSize = 10, search } = query;
  const filter: Record<string, unknown> = { userId };

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const [agents, total] = await Promise.all([
    Agent.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Agent.countDocuments(filter),
  ]);

  return { agents, total };
};

export const getAgentById = async (userId: string, agentId: string): Promise<IAgent | null> => {
  return Agent.findOne({ _id: agentId, userId });
};

export const updateAgent = async (
  userId: string,
  agentId: string,
  data: UpdateAgentInput
): Promise<IAgent | null> => {
  return Agent.findOneAndUpdate({ _id: agentId, userId }, data, { new: true, runValidators: true });
};

export const deleteAgent = async (userId: string, agentId: string): Promise<boolean> => {
  const result = await Agent.findOneAndDelete({ _id: agentId, userId });
  return !!result;
};
