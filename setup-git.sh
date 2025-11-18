#!/bin/bash

# Git Setup Script for CRT Interactive Album
# This script helps you quickly set up and push your project to GitHub

echo "🖥️  CRT Interactive Album - Git Setup"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already initialized"
fi

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo ""
    echo "📝 Uncommitted changes detected. Creating commit..."
    git add .
    git commit -m "Setup database and Vercel deployment configuration"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Check if remote is set
if ! git remote | grep -q origin; then
    echo ""
    echo "🔗 No remote repository found."
    echo "Please enter your GitHub repository URL:"
    echo "Example: https://github.com/username/CRTinteractiveAlbum.git"
    read -p "Repository URL: " repo_url
    
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote repository added"
    else
        echo "⚠️  No URL provided. Skipping remote setup."
    fi
else
    echo "✅ Remote repository already configured"
    git remote -v
fi

# Ask if user wants to push
echo ""
read -p "📤 Push to GitHub now? (y/n): " push_confirm

if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]; then
    echo "Pushing to GitHub..."
    git push -u origin main
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Click 'Add New...' → 'Project'"
    echo "3. Import your GitHub repository"
    echo "4. Follow the deployment checklist in DEPLOYMENT_CHECKLIST.md"
else
    echo ""
    echo "⏭️  Skipped push. You can push later with:"
    echo "   git push -u origin main"
fi

echo ""
echo "📚 For detailed deployment instructions, see:"
echo "   - DEPLOYMENT_CHECKLIST.md (quick reference)"
echo "   - DEPLOYMENT.md (detailed guide)"
echo ""
echo "Happy deploying! 🎉"
