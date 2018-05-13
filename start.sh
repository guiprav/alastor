#!/bin/sh
set -e

if [ -z "$NODE_ENV" ]; then
  export NODE_ENV=development
fi

if [ "$NODE_ENV" != "production" ]; then
  export BUILD_MODE=watchify
fi

(cd client && ./build.sh) &
node app.js
