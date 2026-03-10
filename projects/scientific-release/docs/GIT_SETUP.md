# Git Setup Guide

## Initialize Git Repository

```bash
cd /home/admin/.openclaw/workspace/projects/scientific-release

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit - Scientific Release Mini-Program v1.0"

# Create main branch
git branch -M main
```

## Connect to GitHub (Optional but Recommended)

```bash
# Create a private repository on GitHub first
# Then connect:
git remote add origin git@github.com:YOUR_USERNAME/scientific-release.git

# Push to GitHub
git push -u origin main
```

## Daily Development Workflow

```bash
# Before starting work
git pull origin main

# After making changes
git add .
git commit -m "Description of changes"
git push origin main
```

## Branch Strategy

```bash
# Create feature branch
git checkout -b feature/calendar-module

# After completing feature
git checkout main
git merge feature/calendar-module
git push origin main

# Delete feature branch
git branch -d feature/calendar-module
```

## Important Notes

- Never commit sensitive data (passwords, API keys)
- Use `backend/config/config.js` for local config (already in .gitignore)
- Use environment variables for production secrets
