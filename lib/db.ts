import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import pg from "pg";
import { env } from "@/lib/env";

config({ path: ".env.local" });

const prismaClientSingleton = () => {
  // Use Vercel's POSTGRES_URL (direct connection), fallback to DATABASE_URL for local dev
  const connectionString = env.POSTGRES_URL || env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (!env.isProduction) globalThis.prismaGlobal = prisma;
