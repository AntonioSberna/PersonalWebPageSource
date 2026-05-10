#!/bin/bash
set -e

echo "Building site..."
./hugo --minify

echo "Deploying to GitHub Pages..."
cd public
git add .
git commit -m "deploy $(date '+%Y-%m-%d %H:%M')"
git push origin master --force
cd ..

echo "Done! Site live at https://antoniosberna.github.io"
