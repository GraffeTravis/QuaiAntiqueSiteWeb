#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-http://localhost:8000/api/}"

if ! printf '%s' "$API_BASE_URL" | grep -Eq '^https?://[A-Za-z0-9.-]+(:[0-9]{1,5})?/api/$'; then
    echo "API_BASE_URL must be an http(s) URL ending in /api/." >&2
    exit 1
fi

envsubst '${API_BASE_URL}' \
    < /usr/share/nginx/html/docker-config.js.template \
    > /usr/share/nginx/html/docker-config.js
