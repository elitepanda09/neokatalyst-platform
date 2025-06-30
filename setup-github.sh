#!/bin/bash

# 🚀 neokatalyst GitHub Setup Script
# This script prepares your project for GitHub and deployment

echo "🚀 Setting up neokatalyst for GitHub deployment..."

# Remove existing git if any
if [ -d ".git" ]; then
    echo "📁 Removing existing git repository..."
    rm -rf .git
fi

# Initialize new git repository
echo "🔧 Initializing new git repository..."
git init

# Configure git (optional - user can skip)
echo "👤 Git configuration (press Enter to skip):"
read -p "Enter your name: " git_name
read -p "Enter your email: " git_email

if [ ! -z "$git_name" ]; then
    git config user.name "$git_name"
fi

if [ ! -z "$git_email" ]; then
    git config user.email "$git_email"
fi

# Add all files
echo "📦 Adding all files to git..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "🚀 Initial neokatalyst digital transformation platform

✨ Features included:
- 🔐 Authentication & User Management
- 🤖 Business Process Automation  
- 📊 Real-time Analytics Dashboard
- 📁 Document Management System
- 🛒 E-commerce Marketplace
- 👥 Team Collaboration Tools

🛠 Tech Stack:
- Frontend: React 19 + Tailwind CSS
- Backend: FastAPI + MongoDB
- Deployment: Vercel + Railway"

echo ""
echo "🎉 Git repository initialized successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Copy the repository URL"
echo "3. Run: git remote add origin YOUR_GITHUB_URL"
echo "4. Run: git push -u origin main"
echo ""
echo "🌐 Then follow DEPLOYMENT.md for Vercel + Railway setup"
echo ""

# Ask for GitHub repository URL
read -p "🔗 Enter your GitHub repository URL (optional): " github_url

if [ ! -z "$github_url" ]; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin "$github_url"
    
    echo "📤 Pushing to GitHub..."
    git push -u origin main
    
    echo "✅ Pushed to GitHub successfully!"
    echo "🌐 Now visit the DEPLOYMENT.md file for next steps"
else
    echo "⏭️  Skipping GitHub push. Add remote manually:"
    echo "   git remote add origin YOUR_GITHUB_URL"
    echo "   git push -u origin main"
fi

echo ""
echo "🎯 Repository ready for Vercel + Railway deployment!"