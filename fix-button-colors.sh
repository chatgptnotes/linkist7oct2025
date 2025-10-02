#!/bin/bash

# Script to change all button colors to red across the project
# This changes bg-blue/green/purple/indigo-600 to bg-red-600
# And their hover states to hover:bg-red-700

echo "🎨 Fixing button colors to red..."

# Find all TSX files and replace button colors
find app components -name "*.tsx" -type f | while read file; do
  # Replace primary button colors
  sed -i '' 's/bg-blue-600/bg-red-600/g' "$file"
  sed -i '' 's/bg-indigo-600/bg-red-600/g' "$file"
  sed -i '' 's/bg-purple-600/bg-red-600/g' "$file"
  sed -i '' 's/bg-green-600/bg-red-600/g' "$file"
  sed -i '' 's/bg-cyan-600/bg-red-600/g' "$file"

  # Replace hover states
  sed -i '' 's/hover:bg-blue-700/hover:bg-red-700/g' "$file"
  sed -i '' 's/hover:bg-indigo-700/hover:bg-red-700/g' "$file"
  sed -i '' 's/hover:bg-purple-700/hover:bg-red-700/g' "$file"
  sed -i '' 's/hover:bg-green-700/hover:bg-red-700/g' "$file"
  sed -i '' 's/hover:bg-cyan-700/hover:bg-red-700/g' "$file"

  # Replace focus states
  sed -i '' 's/focus:ring-blue-500/focus:ring-red-500/g' "$file"
  sed -i '' 's/focus:ring-indigo-500/focus:ring-red-500/g' "$file"
  sed -i '' 's/focus:ring-purple-500/focus:ring-red-500/g' "$file"
  sed -i '' 's/focus:ring-green-500/focus:ring-red-500/g' "$file"
done

echo "✅ Button colors updated to red!"
