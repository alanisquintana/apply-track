#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/AlanisQuintana/applytrack.git"
INSTALL_DIR="$HOME/applytrack"

echo "Installing ApplyTrack..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
  echo "Docker not found. Please install Docker first: https://docs.docker.com/get-docker/"
  exit 1
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
  echo "Docker Compose not found. Please update Docker to a version that includes Compose."
  exit 1
fi

# Check Make
if ! command -v make &> /dev/null; then
  echo "Make not found. Please install it (usually pre-installed on macOS/Linux; on Windows use WSL)."
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
make up

echo ""
echo "ApplyTrack is running!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
