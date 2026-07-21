#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/alanisquintana/apply-track.git"
INSTALL_DIR="$HOME/applytrack"

echo "Installing ApplyTrack..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Please install Node.js 20+ first: https://nodejs.org/"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "Node.js 20+ is required. Current version: $(node -v)"
  exit 1
fi

# Check Git
if ! command -v git &> /dev/null; then
  echo "Git not found. Please install Git first: https://git-scm.com/"
  exit 1
fi

# Clone or update repo
if [ -d "$INSTALL_DIR" ]; then
  echo "Directory $INSTALL_DIR already exists. Pulling latest changes..."
  cd "$INSTALL_DIR" && git pull
else
  echo "Cloning repository into $INSTALL_DIR..."
  git clone "$REPO_URL" "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

# Setup env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Run
echo ""
echo "Starting ApplyTrack..."
node start.js

echo ""
echo "ApplyTrack is running!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
