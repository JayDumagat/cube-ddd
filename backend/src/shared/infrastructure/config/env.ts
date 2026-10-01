import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(3000),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(z.treeifyError(parsedEnv.error));

  process.exit(1);
}

const data = parsedEnv.data;

export const env = {
  nodeEnv: data.NODE_ENV,
  port: data.PORT,

  database: {
    host: data.DB_HOST,
    port: data.DB_PORT,
    username: data.DB_USERNAME,
    password: data.DB_PASSWORD,
    name: data.DB_NAME,
  },
} as const;