# Client Template
test deploy
Shared client-site template for the website + CMS projects that read and update
their `clients` row in the shared Supabase project.

## Auth Notes

- Normal client editor access is still controlled by `clients.allowed_editor_ids`.
- Login-link dispatch is controlled by `clients.allowed_editor_emails`.
- `ADMIN_USER_ID` provides a global owner/admin bypass for the shared internal
  operator account.
- `CMS_OWNER_USER_ID` is still accepted temporarily as a legacy fallback during
  rollout, but new deployments should only set `ADMIN_USER_ID`.
- `/auth/callback` finalizes Supabase email auth links and redirects back into
  the CMS.
- `/login` is email-only and requests a magic link through a site-local API.

## Required `clients` Columns

- `allowed_editor_ids uuid[]`
- `allowed_editor_emails text[]`

## Getting Started

Run the development server:

```bash
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Duplicate This Template

Create a new project folder from this template:

```bash
yarn duplicate my-new-project --no-remote
```

That creates `$PROJECTS_DIRECTORY/my-new-project`. Omit `--no-remote` when you
want the script to run the Supabase and GitHub setup too.
