export interface MakeCallPayload {
  to: string;
  message?: string;
}

export interface CallData {
  callSid: string;
  status: string;
  from: string;
  to: string;
  dateCreated: string;
}

export interface CallResponse {
  success: boolean;
  message: string;
  data?: CallData;
}

export interface CallLogItem {
  callSid: string;
  from: string;
  to: string;
  status: string;
  direction: string;
  duration: string;
  startTime: string;
  endTime: string;
  price: string | null;
  priceUnit: string;
}

export interface CallLogsResponse {
  success: boolean;
  message: string;
  data: CallLogItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CallLogsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  to?: string;
  from?: string;
}
