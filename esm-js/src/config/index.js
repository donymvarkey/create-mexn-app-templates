import { config } from 'dotenv-flow';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('8000'),
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL environment variable is required',
  }),
  SECRET: z.string({
    required_error: 'SECRET environment variable is required for JWT',
  }),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SERVER_URL: z.string().default('http://localhost:8000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

const envVars = parsedEnv.data;

export default {
  port: envVars.PORT,
  database_url: envVars.DATABASE_URL,
  secret: envVars.SECRET,
  env: envVars.NODE_ENV,
  server_url: envVars.SERVER_URL,
};
