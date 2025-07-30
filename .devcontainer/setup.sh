#!/bin/bash
set -e

cd /workspaces/invokeai-dev
uv venv --relocatable --prompt invoke --python 3.12 --python-preference only-managed .venv
source .venv/bin/activate
uv pip install -e ".[dev,test,docs,xformers]" --python 3.12 --python-preference only-managed --index=https://download.pytorch.org/whl/cu128 --reinstall
cd /workspaces/invokeai-dev/invokeai/frontend/web
pnpm i