import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClient: PrismaClient | undefined;
}

function getPrismaClient() {
  if (typeof global === "undefined") {
    return new PrismaClient();
  }

  if (global.prismaClient) {
    return global.prismaClient;
  }

  const client = new PrismaClient();

  if (process.env.NODE_ENV !== "production") {
    global.prismaClient = client;
  }

  return client;
}

const prisma = getPrismaClient();

export { prisma };
