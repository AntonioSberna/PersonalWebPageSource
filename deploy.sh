#!/bin/bash
set -e

# Commit only if something changed: with nothing to commit "git commit" fails and,
# because of "set -e", the script would stop before publishing the site.
commit_if_changed() {
  git add .
  if git diff --cached --quiet; then
    echo "Nothing to commit here"
  else
    git commit -m "deploy $(date '+%Y-%m-%d %H:%M')"
  fi
}

echo "Cleaning public/ (keeping its .git)..."
if [ ! -d public/.git ]; then
  echo "public/.git not found, aborting so the GitHub Pages repo is not lost"; exit 1
fi
find public -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

echo "Building site..."
./hugo --minify

echo "Pushing website codesource"
commit_if_changed
git push origin master --force

echo "Deploying to GitHub Pages..."
cd public
commit_if_changed
git push origin master --force
cd ..

echo "Done! Site live at https://antoniosberna.github.io"
