#!/bin/bash
set -e

# Remove stale lock file
rm -f /home/runner/workspace/.git/index.lock

# Check status
git status --short

# Show commits to push
git log --oneline origin/main..HEAD

# Push to GitHub
git push origin main

echo "Push complete!"
