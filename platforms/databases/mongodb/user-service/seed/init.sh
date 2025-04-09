#!/usr/bin/env bash
set -e

echo "Importing JSON files into MongoDB..."

mongoimport --db user-service --collection user_profiles --jsonArray --file /docker-entrypoint-initdb.d/user-service.user_profiles.json

echo "Finished importing JSON data."