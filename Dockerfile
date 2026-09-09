FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# =========================
# System packages
# =========================
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    ca-certificates \
    tar \
    nginx \
    openssh-server \
    procps \
    iproute2 \
    net-tools \
    nano \
    vim \
    && rm -rf /var/lib/apt/lists/*

# =========================
# Required directories
# =========================
RUN mkdir -p \
    /run/sshd \
    /root/.ssh \
    /data/x-ui \
    /usr/local/x-ui

# =========================
# Install 3X-UI
# =========================
WORKDIR /tmp

RUN wget -O x-ui.tar.gz \
    https://github.com/MHSanaei/3x-ui/releases/download/v3.7.0/x-ui-linux-amd64.tar.gz \
    && tar -xzf x-ui.tar.gz \
    && cp -a x-ui/. /usr/local/x-ui/ \
    && rm -rf x-ui x-ui.tar.gz

# =========================
# Nginx
# =========================
COPY railway.conf /etc/nginx/sites-available/default

# =========================
# Startup
# =========================
COPY start-railway.sh /usr/local/bin/start-railway.sh

RUN chmod +x /usr/local/bin/start-railway.sh

# Railway public HTTP port
EXPOSE 8080

# SSH
EXPOSE 22

ENTRYPOINT ["/usr/local/bin/start-railway.sh"]