export interface Agent {
  _id: string;
  userId: string;
  name: string;
  systemPrompt: string;
  voice: string;
  greeting: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentsResponse {
  success: boolean;
  data: Agent[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: Agent;
}

export interface CreateAgentPayload {
  name: string;
  systemPrompt: string;
  voice?: string;
  greeting?: string;
}

export interface UpdateAgentPayload {
  name?: string;
  systemPrompt?: string;
  voice?: string;
  greeting?: string;
}
