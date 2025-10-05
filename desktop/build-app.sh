#!/bin/bash

# TaskFlow Desktop Build Script
# This script builds the complete desktop application

set -e

echo "🚀 Building TaskFlow Desktop Application..."
echo ""

# Step 1: Build Frontend
echo "📦 Step 1/3: Building frontend..."
cd ../frontend
npm install
npm run build
echo "✅ Frontend built successfully"
echo ""

# Step 2: Build Backend
echo "📦 Step 2/3: Building backend..."
cd ../backend
npm install
npm run build
echo "✅ Backend built successfully"
echo ""

# Step 3: Build Desktop App
echo "📦 Step 3/3: Building desktop application..."
cd ../desktop
npm install

# Detect platform and build
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Building for macOS..."
    npm run build:mac
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "Building for Windows..."
    npm run build:win
else
    echo "Building for Linux..."
    npm run build:linux
fi

echo ""
echo "🎉 Build complete!"
echo ""
echo "📦 Installers are in: desktop/dist/"
echo ""
ls -lh dist/
