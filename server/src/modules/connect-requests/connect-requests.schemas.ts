import { z } from 'zod';

export const createConnectRequestSchema = z.object({
  goal: z.string().min(10),
  requester: z.string().trim().optional().default(''),
});

export type CreateConnectRequestBody = z.infer<typeof createConnectRequestSchema>;

export type ConnectRequestResponse = {
  id: string;
  goal: string;
  requester?: string;
  createdAt: string;
};

