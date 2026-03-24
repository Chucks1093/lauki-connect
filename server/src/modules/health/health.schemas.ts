export type HealthResponse = {
  ok: boolean;
  service: string;
  timestamp: string;
  databaseConnected: boolean;
};

export type HealthApiResponse = {
  success: true;
  message: string;
  data: HealthResponse;
};

