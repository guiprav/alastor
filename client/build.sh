#!/bin/bash
set -e

if [ -z "$BUILD_MODE" ]; then
  BUILD_MODE="browserify"
fi

npx "$BUILD_MODE" -v -t cssify app.js -o public/bundle.js
