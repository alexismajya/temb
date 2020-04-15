export interface IScheduleRequest {
  isRecurring?: boolean;
  time?: string;
  cron?: {
    isSequential: boolean;
    repeatTime?: string;
    repeatSequence?: string;
  };
  timeZone?: string;
  payload: {
    queueName: string;
    callbackUrl: string;
    key: string;
    args: any;
  };
}

export interface IClientData {
  clientId: string;
  clientSecret: string;
}

export interface IJobData {
  queueName: string;
  callbackUrl: string;
  key: string;
  args: any;
  clientId: string;
}

export interface IDateData {
  day: string;
  month: string;
}

export interface ITimeData {
  hour: string;
  minute: string;
}

export interface IRequestOptions {
  url: string;
  body: any;
  headers: {
    'scheduler-secret': string;
  };
  json: boolean;
}
