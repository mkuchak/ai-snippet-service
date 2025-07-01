import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().url().default("mongodb://localhost:27017/ai-snippet-service"),
  MONGODB_USERNAME: z.string().default("admin"),
  MONGODB_PASSWORD: z.string().default("password"),
  MONGODB_DATABASE: z.string().default("ai-snippet-service"),
  MONGODB_DATABASE_DEV: z.string().default("ai-snippet-service-dev"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

const validatedEnv = envSchema.parse(process.env);

export const env = {
  PORT: validatedEnv.PORT,
  NODE_ENV: validatedEnv.NODE_ENV,
  MONGODB_URI: validatedEnv.MONGODB_URI,
  MONGODB_USERNAME: validatedEnv.MONGODB_USERNAME,
  MONGODB_PASSWORD: validatedEnv.MONGODB_PASSWORD,
  MONGODB_DATABASE: validatedEnv.MONGODB_DATABASE,
  MONGODB_DATABASE_DEV: validatedEnv.MONGODB_DATABASE_DEV,
  GEMINI_API_KEY: validatedEnv.GEMINI_API_KEY,
  OPENAI_API_KEY: validatedEnv.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: validatedEnv.ANTHROPIC_API_KEY,
};
