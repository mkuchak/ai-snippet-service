import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().url().default("mongodb://localhost:27017/ai-snippet-service"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

const validatedEnv = envSchema.parse(process.env);

export const env = {
  PORT: validatedEnv.PORT,
  NODE_ENV: validatedEnv.NODE_ENV,
  MONGODB_URI: validatedEnv.MONGODB_URI,
  GEMINI_API_KEY: validatedEnv.GEMINI_API_KEY,
  OPENAI_API_KEY: validatedEnv.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: validatedEnv.ANTHROPIC_API_KEY,
};
