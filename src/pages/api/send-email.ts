import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { serverEnv } from "src/lib/env/server";
import { z } from "zod";

type SendEmailResponse = {
  success: boolean;
  error?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const contactPayloadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(3).max(40),
  service: z.string().trim().min(1).max(100),
  message: z.string().trim().max(4000).optional().default(""),
  website: z.string().trim().optional().default(""),
  submittedAt: z.number().int().positive().optional(),
});

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const MIN_FORM_FILL_MS = 3000;
const MAX_PAYLOAD_BYTES = 20 * 1024;

type RateBucket = { count: number; resetAt: number };
const rateLimitStore = new Map<string, RateBucket>();

function getIp(req: NextApiRequest) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") return fwd.split(",")[0].trim();
  if (Array.isArray(fwd)) return fwd[0]?.split(",")[0].trim() || "unknown";
  return req.socket.remoteAddress || "unknown";
}

function getRateLimitKey(req: NextApiRequest, email: string) {
  return `${getIp(req)}:${email.toLowerCase()}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || now >= bucket.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  rateLimitStore.set(key, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

function looksAutomated(payload: z.infer<typeof contactPayloadSchema>) {
  if (payload.website) return true;
  if (typeof payload.submittedAt === "number") {
    return Date.now() - payload.submittedAt < MIN_FORM_FILL_MS;
  }
  return false;
}

function payloadTooLarge(req: NextApiRequest) {
  const rawLength = req.headers["content-length"];
  const contentLength = typeof rawLength === "string" ? Number(rawLength) : NaN;
  return Number.isFinite(contentLength) && contentLength > MAX_PAYLOAD_BYTES;
}

function hasJsonContentType(req: NextApiRequest) {
  const header = req.headers["content-type"];
  const contentType = Array.isArray(header) ? header[0] : header;
  return !!contentType && contentType.includes("application/json");
}

function isSameOriginOrMissing(req: NextApiRequest) {
  const { host } = req.headers;
  if (!host) return false;

  const rawOrigin = req.headers.origin;
  const rawReferer = req.headers.referer;
  const toHost = (value?: string | string[]) => {
    const raw = Array.isArray(value) ? value[0] : value;
    if (!raw) return null;
    try {
      return new URL(raw).host;
    } catch {
      return null;
    }
  };

  const originHost = toHost(rawOrigin);
  const refererHost = toHost(rawReferer);

  if (!originHost && !refererHost) return true;
  if (originHost && originHost !== host) return false;
  if (refererHost && refererHost !== host) return false;
  return true;
}

function genericSuccess(res: NextApiResponse<SendEmailResponse>) {
  return res.status(200).json({ success: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendEmailResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  if (!hasJsonContentType(req)) {
    return genericSuccess(res);
  }

  if (!isSameOriginOrMissing(req)) {
    return genericSuccess(res);
  }

  if (payloadTooLarge(req)) {
    return genericSuccess(res);
  }

  const parsed = contactPayloadSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return genericSuccess(res);
  }

  const payload = parsed.data;
  if (looksAutomated(payload)) {
    return genericSuccess(res);
  }

  const rateKey = getRateLimitKey(req, payload.email);
  if (isRateLimited(rateKey)) {
    return genericSuccess(res);
  }

  try {
    const {
      SMTP_HOST: smtpHost,
      SMTP_PORT: smtpPort,
      SMTP_USER: smtpUser,
      SMTP_PASS: smtpPass,
      CONTACT_ENQUIRY_TO: enquiryTo,
      CONTACT_ENQUIRY_FROM: enquiryFrom,
    } = serverEnv;

    if (
      !smtpHost ||
      !smtpPort ||
      !smtpUser ||
      !smtpPass ||
      !enquiryTo ||
      !enquiryFrom
    ) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to send email" });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: enquiryFrom,
      to: enquiryTo,
      subject: "New Website Form Enquiry",
      text: `
Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
Service: ${payload.service}

Message:
${payload.message}
      `,
      html: `
<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
  <h2 style="margin:0 0 16px;font-size:20px;">New Website Form Enquiry</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;">
    <tr>
      <td style="padding:8px 0;font-weight:700;width:120px;">Name</td>
      <td style="padding:8px 0;">${escapeHtml(payload.name)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:700;">Email</td>
      <td style="padding:8px 0;">${escapeHtml(payload.email)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:700;">Phone</td>
      <td style="padding:8px 0;">${escapeHtml(payload.phone)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:700;">Service</td>
      <td style="padding:8px 0;">${escapeHtml(payload.service)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:700;vertical-align:top;">Message</td>
      <td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(payload.message)}</td>
    </tr>
  </table>
</div>
      `,
    });

    return genericSuccess(res);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send email" });
  }
}
