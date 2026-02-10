import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Only load .env.local in development
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: env("DATABASE_URL"),
    ...(process.env.SHADOW_DATABASE_URL && {
      shadowDatabaseUrl: env("SHADOW_DATABASE_URL")
    })
  }
});
