import type { NextApiRequest, NextApiResponse } from "next";

function parseUrlHost(value?: string | string[] | null) {
  if (!value) return null;
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  try {
    return new URL(raw).host;
  } catch {
    return null;
  }
}

export function enforceContentType(
  req: NextApiRequest,
  res: NextApiResponse,
  expected: "application/json" | "multipart/form-data"
) {
  const header = req.headers["content-type"];
  const contentType = Array.isArray(header) ? header[0] : header;

  if (!contentType || !contentType.includes(expected)) {
    res.status(415).json({ error: "Unsupported Media Type" });
    return false;
  }

  return true;
}

export function enforceSameOrigin(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: { allowMissingHeaders?: boolean }
) {
  const host = req.headers.host;
  const originHost = parseUrlHost(req.headers.origin || null);
  const refererHost = parseUrlHost(req.headers.referer || null);
  const allowMissingHeaders = options?.allowMissingHeaders ?? false;

  if (!host) {
    res.status(400).json({ error: "Bad Request" });
    return false;
  }

  if (!originHost && !refererHost) {
    if (allowMissingHeaders) return true;
    res.status(403).json({ error: "Forbidden" });
    return false;
  }

  if (
    (originHost && originHost !== host) ||
    (refererHost && refererHost !== host)
  ) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }

  return true;
}
