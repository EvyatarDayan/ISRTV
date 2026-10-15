#!/usr/bin/env bash
# Package ISRTV and install it on the Samsung TV.
#
# Usage:
#   ./scripts/push-tv.sh
#
# The TV must be on, on the same Wi-Fi, with Developer Mode enabled.
# Override the defaults if the address changes:
#   TV_IP=192.168.1.230 ./scripts/push-tv.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TV_IP="${TV_IP:-192.168.1.230}"
TV_PORT="${TV_PORT:-26101}"
TV_SERIAL="${TV_IP}:${TV_PORT}"
TV_NAME="${TV_NAME:-TQ65Q8FAAUXXC}"
APP_ID="${APP_ID:-Cy9LjRYptI.ISRTV}"
CERT_PROFILE="${CERT_PROFILE:-IRSTV}"

export PATH="${HOME}/tizen-studio/tools:${HOME}/tizen-studio/tools/ide/bin:${PATH}"

if ! command -v sdb >/dev/null 2>&1 || ! command -v tizen >/dev/null 2>&1; then
  echo "Tizen Studio CLI not found. Expected sdb and tizen under ~/tizen-studio." >&2
  exit 1
fi

STAGE="$(mktemp -d "${TMPDIR:-/tmp}/isrtv-pack.XXXXXX")"
OUT="${ROOT}/.buildResult"
cleanup() {
  rm -rf "${STAGE}"
}
trap cleanup EXIT

echo "Staging app files (skipping git, scripts, and old packages)..."
mkdir -p "${STAGE}"
rsync -a \
  --exclude '.git' \
  --exclude '.buildResult' \
  --exclude 'scripts' \
  --exclude '*.wgt' \
  --exclude '.sign' \
  --exclude 'author-signature.xml' \
  --exclude 'signature1.xml' \
  --exclude '.manifest.tmp' \
  --exclude '.delta.lst' \
  --exclude '.DS_Store' \
  "${ROOT}/index.html" \
  "${ROOT}/config.xml" \
  "${ROOT}/icon.png" \
  "${ROOT}/.project" \
  "${ROOT}/.tproject" \
  "${ROOT}/.settings" \
  "${ROOT}/css" \
  "${ROOT}/js" \
  "${ROOT}/images" \
  "${ROOT}/subs" \
  "${STAGE}/"

echo "Connecting to ${TV_SERIAL}..."
sdb kill-server >/dev/null 2>&1 || true
sdb start-server
# sdb connect exits 0 even when the TV refuses the connection.
if ! sdb connect "${TV_SERIAL}" | tee /dev/stderr | grep -q "connected to ${TV_SERIAL}"; then
  echo "Could not connect to the TV at ${TV_SERIAL}." >&2
  echo "Turn the TV on, keep Developer Mode on, and check the IP." >&2
  exit 1
fi
sdb devices

echo "Building signed package..."
mkdir -p "${OUT}"
rm -f "${OUT}/ISRTV.wgt"
tizen package -t wgt -s "${CERT_PROFILE}" -o "${OUT}" -- "${STAGE}"
WGT="${OUT}/ISRTV.wgt"
if [[ ! -f "${WGT}" ]]; then
  echo "Package was not created at ${WGT}" >&2
  exit 1
fi
echo "Package: ${WGT} ($(du -h "${WGT}" | awk '{print $1}'))"

echo "Installing on ${TV_NAME}..."
tizen install -n "${WGT}" -t "${TV_NAME}"

echo "Launching ${APP_ID}..."
tizen run -p "${APP_ID}" -t "${TV_NAME}"
echo "ISRTV is installed and open on the TV."
