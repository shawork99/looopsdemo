#!/bin/bash
set -e

echo "Copying .env example"

envsubst < .env.example > .env
