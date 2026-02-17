export interface MakeCallRequest {
  to: string;
  message?: string;
}

export interface CallResponse {
  success: boolean;
  message: string;
  data?: {
    callSid: string;
    status: string;
    from: string;
    to: string;
    dateCreated: string;
  };
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

export interface CallLogsQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  to?: string;
  from?: string;
}
