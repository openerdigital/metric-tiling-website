#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/copy-project.sh <new-project-name> [destination-parent-dir] [--no-remote] [--no-supabase] [--no-github]

Options:
  --no-remote    Skip all remote automation (Supabase + GitHub/push)
  --no-supabase  Skip Supabase clients upsert
  --no-github    Skip GitHub repo creation and git push

If destination-parent-dir is omitted, the script uses PROJECTS_DIRECTORY from
your shell environment. If PROJECTS_DIRECTORY is not set, it falls back to this
template's parent directory.
USAGE
}

require_command() {
  local cmd="$1"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Error: required command not found: ${cmd}"
    exit 1
  fi
}

read_env_value() {
  local file="$1"
  local key="$2"
  local line
  line="$(grep -E "^${key}=" "${file}" | tail -n 1 || true)"
  printf '%s' "${line#*=}"
}

generate_uuid() {
  if command -v uuidgen >/dev/null 2>&1; then
    uuidgen | tr '[:upper:]' '[:lower:]'
    return 0
  fi
  node -e 'console.log(require("crypto").randomUUID())'
}

NO_REMOTE=0
NO_SUPABASE=0
NO_GITHUB=0
POSITIONAL_ARGS=()

for arg in "$@"; do
  case "${arg}" in
    --no-remote)
      NO_REMOTE=1
      ;;
    --no-supabase)
      NO_SUPABASE=1
      ;;
    --no-github)
      NO_GITHUB=1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --*)
      echo "Error: unknown option '${arg}'"
      usage
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("${arg}")
      ;;
  esac
done

if [[ ${#POSITIONAL_ARGS[@]} -lt 1 || ${#POSITIONAL_ARGS[@]} -gt 2 ]]; then
  usage
  exit 1
fi

if [[ "${NO_REMOTE}" -eq 1 ]]; then
  NO_SUPABASE=1
  NO_GITHUB=1
fi

NEW_NAME="${POSITIONAL_ARGS[0]}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEST_PARENT="${POSITIONAL_ARGS[1]:-${PROJECTS_DIRECTORY:-$(dirname "${SOURCE_DIR}")}}"
DEST_DIR="${DEST_PARENT}/${NEW_NAME}"
SOURCE_ENV_LOCAL_PATH="${SOURCE_DIR}/.env.local"
SETTINGS_PATH="${DEST_DIR}/.vscode/settings.json"
DEST_ENV_LOCAL_PATH="${DEST_DIR}/.env.local"
DEFAULT_DATA_PATH="${SOURCE_DIR}/src/lib/defaultData.ts"
GITHUB_OWNER="openerdigital"
CONTACT_ENQUIRY_TO_DEFAULT="justin@openerdigital.co"

if [[ -f "${SOURCE_ENV_LOCAL_PATH}" ]]; then
  SOURCE_CONTACT_ENQUIRY_TO="$(read_env_value "${SOURCE_ENV_LOCAL_PATH}" "CONTACT_ENQUIRY_TO")"
  if [[ -n "${SOURCE_CONTACT_ENQUIRY_TO}" ]]; then
    CONTACT_ENQUIRY_TO_DEFAULT="${SOURCE_CONTACT_ENQUIRY_TO}"
  fi
fi

if [[ -e "${DEST_DIR}" ]]; then
  echo "Error: destination already exists: ${DEST_DIR}"
  exit 1
fi

echo "Step 1/6: Running preflight checks..."
require_command git
require_command curl
require_command node

if [[ "${NO_SUPABASE}" -eq 0 ]]; then
  if [[ ! -f "${SOURCE_ENV_LOCAL_PATH}" ]]; then
    echo "Error: source .env.local not found at ${SOURCE_ENV_LOCAL_PATH}"
    exit 1
  fi
  if [[ ! -f "${DEFAULT_DATA_PATH}" ]]; then
    echo "Error: default data file not found at ${DEFAULT_DATA_PATH}"
    exit 1
  fi
  SUPABASE_URL="$(read_env_value "${SOURCE_ENV_LOCAL_PATH}" "NEXT_PUBLIC_SUPABASE_URL")"
  SUPABASE_SERVICE_ROLE_KEY="$(read_env_value "${SOURCE_ENV_LOCAL_PATH}" "SUPABASE_SERVICE_ROLE_KEY")"
  if [[ -z "${SUPABASE_URL}" || -z "${SUPABASE_SERVICE_ROLE_KEY}" ]]; then
    echo "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must exist in ${SOURCE_ENV_LOCAL_PATH}"
    exit 1
  fi
fi

if [[ "${NO_GITHUB}" -eq 0 ]]; then
  if [[ -z "${OD_GITHUB_TOKEN:-}" ]]; then
    echo "Error: OD_GITHUB_TOKEN is required for GitHub repo creation/push."
    exit 1
  fi
  if [[ -z "$(git config --get user.name || true)" || -z "$(git config --get user.email || true)" ]]; then
    echo "Error: git user.name and user.email must be configured before initial commit/push."
    exit 1
  fi
fi

CLIENT_ID="$(generate_uuid)"
echo "Generated CLIENT_ID: ${CLIENT_ID}"

mkdir -p "${DEST_PARENT}"

echo "Step 2/6: Copying project files..."
rsync -a \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".next" \
  --exclude ".turbo" \
  --exclude "dist" \
  --exclude "coverage" \
  --exclude ".DS_Store" \
  "${SOURCE_DIR}/" "${DEST_DIR}/"

if [[ -f "${SETTINGS_PATH}" ]]; then
  echo "Step 3/6: Updating VS Code window title..."
  node -e '
const fs = require("fs");
const settingsPath = process.argv[1];
const projectName = process.argv[2];
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
settings["window.title"] = `${projectName}\${separator}\${activeEditorShort}\${separator}\${rootName}`;
fs.writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
' "${SETTINGS_PATH}" "${NEW_NAME}"
fi

echo "Step 4/6: Sanitizing copied .env.local and writing generated CLIENT_ID..."
if [[ -f "${DEST_ENV_LOCAL_PATH}" ]]; then
  TMP_ENV_PATH="$(mktemp)"
  awk -v client_id="${CLIENT_ID}" -v contact_enquiry_to="${CONTACT_ENQUIRY_TO_DEFAULT}" '
    BEGIN { saw_blob=0; saw_client=0; saw_contact=0 }
    /^BLOB_READ_WRITE_TOKEN=/ { print "BLOB_READ_WRITE_TOKEN="; saw_blob=1; next }
    /^CLIENT_ID=/ { print "CLIENT_ID=" client_id; saw_client=1; next }
    /^CONTACT_ENQUIRY_TO=/ { saw_contact=1 }
    { print }
    END {
      if (!saw_blob) print "BLOB_READ_WRITE_TOKEN="
      if (!saw_client) print "CLIENT_ID=" client_id
      if (!saw_contact) print "CONTACT_ENQUIRY_TO=" contact_enquiry_to
    }
  ' "${DEST_ENV_LOCAL_PATH}" > "${TMP_ENV_PATH}"
  mv "${TMP_ENV_PATH}" "${DEST_ENV_LOCAL_PATH}"
else
  cat > "${DEST_ENV_LOCAL_PATH}" <<EOF
BLOB_READ_WRITE_TOKEN=
CLIENT_ID=${CLIENT_ID}
CONTACT_ENQUIRY_TO=${CONTACT_ENQUIRY_TO_DEFAULT}
EOF
fi

SUPABASE_OK="skipped"
if [[ "${NO_SUPABASE}" -eq 0 ]]; then
  echo "Step 5/6: Upserting clients row in Supabase..."
  node - "${DEFAULT_DATA_PATH}" "${SUPABASE_URL}" "${SUPABASE_SERVICE_ROLE_KEY}" "${CLIENT_ID}" "${NEW_NAME}" <<'NODE'
const fs = require("fs");
const vm = require("vm");

const [defaultDataPath, supabaseUrlRaw, serviceRoleKey, clientId, projectName] =
  process.argv.slice(2);
const supabaseUrl = supabaseUrlRaw.replace(/\/+$/, "");

function loadDefaultData(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const transformed = source.replace(
    /export\s+default\s+defaultData;\s*$/,
    "module.exports = defaultData;"
  );
  if (transformed === source) {
    throw new Error("Unable to parse defaultData.ts export.");
  }
  const context = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(transformed, context, { filename: filePath });
  return context.module.exports;
}

async function run() {
  const defaultData = loadDefaultData(defaultDataPath);
  const payload = {
    client_id: clientId,
    client_name: projectName,
    content: defaultData,
  };
  const res = await fetch(
    `${supabaseUrl}/rest/v1/clients?on_conflict=client_id`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upsert failed (${res.status}): ${text}`);
  }
}

run().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});
NODE
  SUPABASE_OK="yes"
fi

REPO_HTML_URL=""
if [[ "${NO_GITHUB}" -eq 0 ]]; then
  echo "Step 6/6: Creating GitHub repo and pushing initial commit..."
  GH_RESPONSE="$(
    curl -sS -X POST \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer ${OD_GITHUB_TOKEN}" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "https://api.github.com/orgs/${GITHUB_OWNER}/repos" \
      -d "{\"name\":\"${NEW_NAME}\",\"private\":true}" \
      -w "\n%{http_code}"
  )"
  GH_BODY="${GH_RESPONSE%$'\n'*}"
  GH_STATUS="${GH_RESPONSE##*$'\n'}"

  if [[ "${GH_STATUS}" != "201" ]]; then
    echo "Error: GitHub repo creation failed (HTTP ${GH_STATUS})."
    echo "${GH_BODY}"
    exit 1
  fi

  REPO_HTML_URL="$(
    node -e '
const data = JSON.parse(process.argv[1]);
console.log(data.html_url || "");
' "${GH_BODY}"
  )"
  REPO_HTTP_URL="https://github.com/${GITHUB_OWNER}/${NEW_NAME}.git"

  git -C "${DEST_DIR}" init -b main
  git -C "${DEST_DIR}" add .
  git -C "${DEST_DIR}" commit -m "Initial commit from template"
  git -C "${DEST_DIR}" remote add origin "${REPO_HTTP_URL}"
  git -C "${DEST_DIR}" push "https://x-access-token:${OD_GITHUB_TOKEN}@github.com/${GITHUB_OWNER}/${NEW_NAME}.git" main
fi

echo
echo "Bootstrap complete."
echo "Project path: ${DEST_DIR}"
echo "CLIENT_ID: ${CLIENT_ID}"
echo "Supabase clients upsert: ${SUPABASE_OK}"
if [[ -n "${REPO_HTML_URL}" ]]; then
  echo "GitHub repo: ${REPO_HTML_URL}"
fi

exit 0


# bash scripts/copy-project.sh <new-project-name> /Users/justinlow/Documents/projects --no-remote
