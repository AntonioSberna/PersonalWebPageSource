#!/bin/bash
set -e

echo "Cleaning public/ (keeping its .git)..."
if [ ! -d public/.git ]; then
  echo "public/.git not found, aborting so the GitHub Pages repo is not lost"; exit 1
fi
find public -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

echo "Building site..."
./hugo --minify

echo "Pushing website codesource"
git add .
git commit -m "deploy $(date '+%Y-%m-%d %H:%M')"
git push origin master --force

echo "Deploying to GitHub Pages..."
cd public
git add .
git commit -m "deploy $(date '+%Y-%m-%d %H:%M')"
git push origin master --force
cd ..

echo "Done! Site live at https://antoniosberna.github.io"
