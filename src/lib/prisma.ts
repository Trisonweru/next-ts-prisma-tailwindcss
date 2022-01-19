/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from '@prisma/client';

// Creating a prisma client to help us connect to prisma without making too may connection requests
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}
let prisma: PrismaClient | undefined;

if (typeof window == 'undefined') {
  if (process.env.NODE_ENV == 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
}

export default prisma;
