# Image de base avec support GPU + Python + Node.js
FROM nvidia/cuda:12.2.2-cudnn8-devel-ubuntu22.04

# Install Node.js (via nvm)
ENV NODE_VERSION=22.17.1
ENV NVM_DIR=/root/.nvm

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    curl git python3 python3-pip python3-venv build-essential rsync \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION \
    && echo 'export NVM_DIR="$NVM_DIR"' >> /root/.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /root/.bashrc \
    && echo 'nvm use default' >> /root/.bashrc \
    && ln -s /usr/bin/python3 /usr/bin/python

RUN curl -LsSf https://astral.sh/uv/install.sh | sh

RUN curl -LsSf https://get.pnpm.io/install.sh | sh

# Active immédiatement node/npm pour les futures commandes Docker
ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH"

# Installe pipenv ou autre gestionnaire si tu veux
RUN pip install --upgrade pip
