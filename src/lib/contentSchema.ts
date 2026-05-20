import { z } from "zod";

export const siteContentSchema = z.record(z.string(), z.unknown());

export const updateContentPayloadSchema = z.object({
  content: siteContentSchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type UpdateContentPayload = z.infer<typeof updateContentPayloadSchema>;
