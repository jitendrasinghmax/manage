import { PrismaClient } from "./generated/prisma";

declare global {
  // Prevent redeclaration during hot-reload in dev
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}

export const db =
  globalThis.db ||
  (globalThis.db = new PrismaClient({
    log: ['error', 'warn'],
  }));
