/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useRef, useState } from "react";

import { ContentButton } from "./ContentButton";
import { Label } from "./ContentTextInput";

type UploadedMedia = {
  url: string;
  pathname?: string;
  contentType?: string;
  size?: number;
};

type MediaUploadFieldProps = {
  label?: string;
  value?: string | null; // current URL from RHF
  pathname?: string | null;
  contentType?: "image" | "video" | null;
  onUploaded?: (media: UploadedMedia) => void;
  onDeleted?: () => void; // should clear RHF field in parent
};

const IMAGE_MIME_TYPES = ["image/jpeg", "image/webp"];
const VIDEO_MIME_TYPES = ["video/mp4"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

function isVideo(mime?: string, url?: string) {
  if (mime?.startsWith("video/")) return true;
  if (!url) return false;

  const clean = url.split("?")[0].toLowerCase();
  return [".mp4", ".mov", ".webm", ".m4v"].some((ext) => clean.endsWith(ext));
}

function restrictionError(restriction?: "image" | "video" | null) {
  if (restriction === "image") return "Only image files are allowed";
  if (restriction === "video") return "Only video files are allowed";
  return "Unsupported file type";
}

function sizeError(file: File, restriction?: "image" | "video" | null) {
  const isVideoFile =
    restriction === "video" ||
    (restriction !== "image" && file.type.startsWith("video/"));
  const maxBytes = isVideoFile ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  const maxLabel = isVideoFile ? "15MB" : "3MB";
  if (file.size > maxBytes) return `File is too large (max ${maxLabel})`;
  return null;
}

export function MediaUploadField({
  label = "Upload media",
  value,
  pathname,
  contentType,
  onUploaded,
  onDeleted,
}: MediaUploadFieldProps) {
  const fieldId = `media-upload-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<UploadedMedia | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allowedMimeTypes =
    // eslint-disable-next-line no-nested-ternary
    contentType === "image"
      ? IMAGE_MIME_TYPES
      : contentType === "video"
        ? VIDEO_MIME_TYPES
        : [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES];

  const acceptAttr = allowedMimeTypes.join(",");

  // local preview (picked-but-not-uploaded)
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Hydrate uploaded state from external value (RHF) so preview shows on load
  useEffect(() => {
    const nextUrl = value?.trim() || "";

    if (!nextUrl) {
      // Only clear if we aren't mid-upload/local preview
      if (!file) setUploaded(null);
      return;
    }

    if (uploaded?.url === nextUrl) return;

    setUploaded({
      url: nextUrl,
      pathname: pathname || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pathname, contentType]);

  // Clear local file only after we have an uploaded URL (keeps UI clean after upload)
  const pendingClearRef = useRef(false);
  useEffect(() => {
    if (pendingClearRef.current && uploaded?.url) {
      pendingClearRef.current = false;
      setFile(null);
    }
  }, [uploaded?.url]);

  async function uploadSelected(f: File) {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      if (!allowedMimeTypes.includes(f.type)) {
        throw new Error(restrictionError(contentType));
      }
      const maybeSizeError = sizeError(f, contentType);
      if (maybeSizeError) {
        throw new Error(maybeSizeError);
      }

      const fd = new FormData();
      fd.append("file", f);

      const data = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/api/blob/upload");

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const pct = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(Math.max(0, Math.min(100, pct)));
        };

        xhr.onload = () => {
          const json = (() => {
            try {
              return JSON.parse(xhr.responseText || "{}");
            } catch {
              return {};
            }
          })();

          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve(json);
            return;
          }

          reject(new Error(json?.error || "Upload failed"));
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(fd);
      });

      const next: UploadedMedia = {
        url: data.url,
        pathname: data.pathname,
        contentType: data.contentType,
        size: data.size,
      };

      setUploaded(next);
      onUploaded?.(next);

      pendingClearRef.current = true;
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 400);
    }
  }

  // IMPORTANT: This no longer deletes from Vercel Blob.
  // It only clears local UI state + asks the parent to clear RHF value.
  function clearUploaded() {
    setError(null);
    pendingClearRef.current = false;
    setUploaded(null);
    setFile(null);
    onDeleted?.();
  }

  const showingUploaded = !!uploaded?.url;
  const showingLocalPreview = !!previewUrl;

  const displayUrl = previewUrl || uploaded?.url || "";
  const displayIsVideo = showingLocalPreview
    ? !!file?.type?.startsWith("video/")
    : isVideo(uploaded?.contentType, uploaded?.url);
  const openFilePicker = () => inputRef.current?.click();
  const bubbleClassName = [
    "relative aspect-square w-full overflow-hidden rounded-[10px] border p-1 outline-none transition-colors duration-200",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-cms-form-ring)]",
    isDragging
      ? "border-[var(--color-cms-form-border-focus)] bg-[var(--color-cms-form-surface)]"
      : "border-[var(--color-cms-form-border)] bg-[var(--color-cms-form-surface)]",
  ].join(" ");
  let previewNode = (
    <div
      id={`${fieldId}-help`}
      className="typography-bodySmall px-2 text-center text-[var(--color-cms-form-text)]"
    >
      No file exists. Drop a file here, or click to browse
    </div>
  );
  if (displayUrl && displayIsVideo) {
    previewNode = (
      <video
        src={displayUrl}
        controls
        playsInline
        className="h-full w-full object-contain"
      />
    );
  } else if (displayUrl) {
    previewNode = (
      <img
        src={displayUrl}
        alt="Preview"
        className="h-full w-full object-contain"
      />
    );
  }
  let chooseFileLabel = "Choose File";
  if (isUploading) chooseFileLabel = "Uploading...";
  else if (showingUploaded) chooseFileLabel = "Replace";

  function handlePick(f: File | null) {
    setError(null);
    if (!f) return;

    if (!allowedMimeTypes.includes(f.type)) {
      setError(restrictionError(contentType));
      return;
    }
    const maybeSizeError = sizeError(f, contentType);
    if (maybeSizeError) {
      setError(maybeSizeError);
      return;
    }

    setFile(f);
    // eslint-disable-next-line no-void
    void uploadSelected(f);
  }

  return (
    <div className="max-w-300 flex flex-col">
      <Label className="text-[var(--color-cms-form-label)]">{label}</Label>

      <div className="rounded-[12px] border border-[var(--color-cms-form-border)] bg-[var(--color-cms-form-input-bg)] p-1">
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          disabled={isUploading}
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            e.currentTarget.value = "";
            handlePick(f);
          }}
        />

        <div
          role="button"
          tabIndex={0}
          className={bubbleClassName}
          aria-label={`${label}. Drop a file or click to browse.`}
          aria-disabled={isUploading}
          aria-busy={isUploading}
          aria-describedby={error ? `${fieldId}-error` : `${fieldId}-help`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFilePicker();
            }
          }}
          onClick={openFilePicker}
          onDragOver={(e) => {
            e.preventDefault();
            if (isUploading) return;
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (isUploading) return;
            setIsDragging(false);
            handlePick(e.dataTransfer.files?.[0] || null);
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-[8px] bg-white px-1 py-2">
            {previewNode}
          </div>
          {isUploading ? (
            <div className="pointer-events-none absolute inset-x-1 bottom-1 rounded-[6px] bg-white/90 p-[6px]">
              <div className="mb-[2px] flex items-center justify-between text-[12px] text-[var(--color-cms-form-placeholder)]">
                <span className="leading-none">Uploading</span>
                <span className="leading-none">{uploadProgress}%</span>
              </div>
              <div className="h-[8px] w-full overflow-hidden rounded-full bg-[var(--color-cms-form-surface)]">
                <div
                  className="h-full bg-[var(--color-cms-btn-save-bg)] transition-[width] duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-1 flex items-center gap-1">
          <ContentButton
            variant="add"
            disabled={isUploading}
            onClick={openFilePicker}
          >
            {chooseFileLabel}
          </ContentButton>
          {showingUploaded && !isUploading && (
            // eslint-disable-next-line react/jsx-no-bind
            <ContentButton variant="delete" onClick={clearUploaded}>
              Remove
            </ContentButton>
          )}
        </div>
      </div>

      {error && (
        <div
          id={`${fieldId}-error`}
          className="typography-bodySmall mt-1 text-[var(--color-cms-form-error)]"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
