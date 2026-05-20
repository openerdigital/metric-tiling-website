import { z } from "zod";

import { publicEnv } from "./public";

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  CLIENT_ID: z.string().uuid(),
  CRON_SECRET: z.string().min(1),
  ADMIN_USER_ID: z.string().uuid().optional(),
  CMS_OWNER_USER_ID: z.string().uuid().optional(),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.string().min(1).optional(),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  CONTACT_ENQUIRY_TO: z.string().email().optional(),
  CONTACT_ENQUIRY_FROM: z.string().email().optional(),
});

function resolveAdminUserId(parsed: z.infer<typeof serverEnvSchema>) {
  return parsed.ADMIN_USER_ID ?? parsed.CMS_OWNER_USER_ID;
}

const parsedServerEnv = serverEnvSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  CLIENT_ID: process.env.CLIENT_ID,
  CRON_SECRET: process.env.CRON_SECRET,
  ADMIN_USER_ID: process.env.ADMIN_USER_ID,
  CMS_OWNER_USER_ID: process.env.CMS_OWNER_USER_ID,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CONTACT_ENQUIRY_TO: process.env.CONTACT_ENQUIRY_TO,
  CONTACT_ENQUIRY_FROM: process.env.CONTACT_ENQUIRY_FROM,
});

export const serverEnv = {
  ...parsedServerEnv,
  ADMIN_USER_ID: resolveAdminUserId(parsedServerEnv),
};

export const env = {
  ...publicEnv,
  ...serverEnv,
};
