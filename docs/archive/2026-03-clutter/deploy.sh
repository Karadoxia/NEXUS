#!/bin/bash

# NEXUS Deployment Script
# -----------------------
# This script will help you push your local code to GitHub.

echo "🚀 Starting NEXUS Deployment..."

# 1. Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) could not be found."
    echo "Please install it from https://cli.github.com/ and try again."
    exit 1
fi

# 2. Check Authentication
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "⚠️ You are not logged in to GitHub."
    echo "👉 Please follow the prompts to login:"
    gh auth login
else
    echo "✅ Authenticated as $(gh api user -q .login)"
fi

# 3. Push to Specific Repository
REMOTE_URL="https://github.com/Karadoxia/new-project.git"
BRANCH=$(git branch --show-current)

echo "� Configuring remote 'origin' to $REMOTE_URL..."

# Check if origin exists
if git remote get-url origin &> /dev/null; then
    echo "   Running: git remote set-url origin $REMOTE_URL"
    git remote set-url origin "$REMOTE_URL"
else
    echo "   Running: git remote add origin $REMOTE_URL"
    git remote add origin "$REMOTE_URL"
fi

echo "📦 Pushing code to $BRANCH..."
echo ""
echo "👉 You may be asked to sign in securely via your browser."
echo ""

if git push -u origin "$BRANCH"; then
    echo ""
    echo "✅ SUCCESS! Your code is now live at:"
    echo "   $REMOTE_URL"
else
    echo ""
    echo "❌ Push failed."
    echo "If the error says 'Permission denied' or 'Authentication failed':"
    echo "1. Run: gh auth login"
    echo "2. Select 'GitHub.com' > 'HTTPS' > 'Login with browser'"
    echo "3. Run this script again."
fi
