#!/bin/bash

set -e

echo "======================================"
echo "       Trendify Railway Server"
echo "======================================"

PANEL_PORT=8081
PUBLIC_PORT=8080
XUI_DIR="/usr/local/x-ui"

mkdir -p /run/sshd
mkdir -p /root/.ssh
mkdir -p /data/x-ui

echo "[1/5] Configuring 3X-UI..."

cd "$XUI_DIR"

./x-ui setting -port "$PANEL_PORT" || true
./x-ui setting -listenIP "127.0.0.1" || true

echo "[2/5] Starting 3X-UI..."

./x-ui &
XUI_PID=$!

echo "[3/5] Waiting for 3X-UI..."

for i in $(seq 1 30); do
    if curl -s \
        --connect-timeout 1 \
        "http://127.0.0.1:${PANEL_PORT}" \
        >/dev/null 2>&1; then
        echo "3X-UI is ready."
        break
    fi

    sleep 1
done

echo "[4/5] Starting Nginx..."

nginx -t
nginx

echo "[5/5] Starting SSH..."

/usr/sbin/sshd

echo ""
echo "======================================"
echo "           SERVER READY"
echo "======================================"
echo ""
echo "Nginx  : ${PUBLIC_PORT}"
echo "Panel  : ${PANEL_PORT}"
echo "Xray   : 10001"
echo "Path   : /vless"
echo ""
echo "======================================"

trap 'kill $XUI_PID 2>/dev/null || true; exit 0' SIGTERM SIGINT

wait $XUI_PID