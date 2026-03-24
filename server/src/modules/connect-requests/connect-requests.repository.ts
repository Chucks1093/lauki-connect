import { prisma } from '../../utils/prisma.utils.js';
import type { CreateConnectRequestBody } from './connect-requests.schemas.js';

export const createConnectRequestRecord = async (input: CreateConnectRequestBody) => {
  return prisma.connectRequest.create({
    data: {
      goal: input.goal,
      requester: input.requester || null,
    },
  });
};

export const findConnectRequestRecords = async () => {
  return prisma.connectRequest.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

