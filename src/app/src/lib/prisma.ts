import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "./env.js";

// Validate required env vars before instantiating the Prisma Client so
// any code path that touches the DB fails fast with a clear error.
getDatabaseUrl();

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

// Reuse a single PrismaClient instance across Next.js dev hot-reloads
// to avoid exhausting Postgres connections.
export const prisma: PrismaClient = globalThis.__prisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prisma;
}

export default prisma;
