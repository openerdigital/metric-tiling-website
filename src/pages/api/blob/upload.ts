import { put } from "@vercel/blob";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import {
  enforceContentType,
  enforceSameOrigin,
} from "src/lib/api/requestGuards";
import { requireClientEditor } from "src/lib/auth/requireClientEditor";

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

// Optional (kept from your original)
export const runtime = "nodejs";

const ALLOWED_MIME = new Set(["image/jpeg", "image/webp", "video/mp4"]);

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB
const MAX_VIDEO_BYTES = 15 * 1024 * 1024; // 15MB

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function parseForm(req: NextApiRequest): Promise<{ file: any }> {
  const form = formidable({
    multiples: false,
    maxFileSize: MAX_VIDEO_BYTES,
    filter: (part: any) => {
      // Only accept the "file" field and allowed mime types
      if (part.name !== "file") return false;
      return !!part.mimetype && ALLOWED_MIME.has(part.mimetype);
    },
  });

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) return reject(err);

      const f = files.file;
      const file = Array.isArray(f) ? f[0] : f;

      if (!file) return reject(new Error("No file provided"));
      resolve({ file });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  if (!enforceContentType(req, res, "multipart/form-data")) {
    return;
  }
  if (!enforceSameOrigin(req, res)) {
    return;
  }

  const access = await requireClientEditor({ req, res });
  if (!access.ok) {
    res.status(access.status).json({ error: access.error });
    return;
  }

  try {
    const { file } = await parseForm(req);

    const mime = file.mimetype || "";
    if (!ALLOWED_MIME.has(mime)) {
      res.status(400).json({
        error:
          "Unsupported file type. Allowed formats: image/jpeg, image/webp, video/mp4",
      });
      return;
    }

    let fileSize = 0;
    if (typeof file.size === "number") {
      fileSize = file.size;
    } else if (typeof file.fileSize === "number") {
      fileSize = file.fileSize;
    }

    if (mime.startsWith("image/") && fileSize > MAX_IMAGE_BYTES) {
      res.status(400).json({ error: "Image is too large (max 3MB)" });
      return;
    }

    if (mime.startsWith("video/") && fileSize > MAX_VIDEO_BYTES) {
      res.status(400).json({ error: "Video is too large (max 15MB)" });
      return;
    }

    // Read uploaded temp file into a Buffer for put()
    const buffer = await fs.promises.readFile(file.filepath);

    const original = file.originalFilename || "upload";
    const safeName = sanitizeFilename(original);

    const key = `${Date.now()}_${safeName}`;

    const blob = await put(key, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
    });

    res.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (err: any) {
    const msg =
      typeof err?.message === "string" ? err.message : "Upload failed";
    res.status(400).json({ error: msg });
  }
}
