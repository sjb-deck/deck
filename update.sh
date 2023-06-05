#!/bin/bash
set -euo pipefail

cd ..
echo "Activating virtual environment..."
source deck-env/env/bin/activate
cd deck
echo "Stashing changes..."
git stash
echo "Dropping stashed changes..."
git stash drop
echo "Pulling latest changes from Git..."
git pull
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Switching Node.js version based on .nvmrc..."
source ~/.nvm/nvm.sh
nvm install
nvm use

echo "Pruning NPM dependencies..."
npm prune
echo "Installing NPM dependencies..."
npm install
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate
echo "Building project..."
npm run build
echo "Update script completed successfully!"