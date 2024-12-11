#!/bin/bash
set -e

# Debugging: Print environment variables
echo "Running entrypoint.sh..."
echo "Auth Secret: ${NEXT_PUBLIC_AUTH_SECRET}"
echo "Backend URL: ${NEXT_PUBLIC_BACKEND_URL}"

#if [ ! -f .env ]; then
#    echo ".env not found!" >&2
#    exit 1
#fi

# Replace with sed, using alternate delimiter `#`
if [ -n "${NEXT_PUBLIC_AUTH_SECRET}" ] && [ -n "${NEXT_PUBLIC_BACKEND_URL}" ]; then
    sed -i "s#auth_secret#${NEXT_PUBLIC_AUTH_SECRET}#g" .env.production
    sed -i "s#backend_url#${NEXT_PUBLIC_BACKEND_URL}#g" .env.production

    cat .env.production
else
    echo "Environment variables are missing!" >&2
fi

exec "$@"
