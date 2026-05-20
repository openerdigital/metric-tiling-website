# Security Checklist

Use this checklist before launching each cloned client project.

## 1) Supabase RLS Setup (`clients` table)

1. Open Supabase Dashboard -> SQL Editor.
2. Ensure table `public.clients` exists with at least:
   - `client_id` (uuid, primary key or unique)
   - `content` (jsonb)
   - `allowed_editor_ids` (uuid[] or text[] that stores auth user IDs)
   - `allowed_editor_emails` (text[] that stores normalized editor emails)
3. Enable Row Level Security:
   - Table Editor -> `clients` -> RLS -> Enable.
4. Create policy to **deny anon** reads/writes (default deny with no anon policies).
5. Create policy to allow authenticated editors for this client:
   - `SELECT` where `auth.uid()` is in `allowed_editor_ids`.
   - `UPDATE` where `auth.uid()` is in `allowed_editor_ids`.
6. If you add `auth.users` cleanup triggers, match the trigger SQL to the array type:
   - for `uuid[]`, compare/remove with `old.id`
   - for `text[]`, compare/remove with `old.id::text`
7. Do not create open `INSERT/UPDATE/DELETE` policies for `anon`.
8. Keep all service-role operations server-side only (`SUPABASE_SERVICE_ROLE_KEY` must never be in client code).

## 2) Environment Variables

1. Set `NEXT_PUBLIC_*` values only for public-safe variables.
2. Set server-only values in Vercel/hosting environment:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
   - `SMTP_*`
   - `CONTACT_ENQUIRY_*`
3. Set per-client IDs:
   - `CLIENT_ID`
   - optional `ADMIN_USER_ID`
4. Never commit real values to git.

## 3) Runtime Verification

1. Login as an admin/editor.
2. Run security self-check:
   - `GET /api/admin/security-check`
3. Confirm:
   - required columns are detected
   - `anonReadBlocked` is `true`
   - owner bypass status matches your config

## 4) Admin/API Security

1. Verify unauthenticated access to `/admin` redirects to `/login`.
2. Verify `/api/auth/request-login-link` returns a generic success response for both allowed and disallowed emails.
3. Verify authenticated non-editor cannot update CMS.
4. Verify `/api/content/update` and `/api/blob/upload` reject cross-origin requests.
5. Verify `/api/blob/clean` requires `Authorization: Bearer <CRON_SECRET>`.

## 5) Contact Form Abuse Controls

1. Confirm honeypot field is hidden and empty for normal users.
2. Confirm too-fast submissions are silently dropped.
3. Confirm repeated burst submissions are rate-limited.
4. Confirm normal submissions still send email.
