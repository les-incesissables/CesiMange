#!/usr/bin/env bash
set -e

echo "Importing JSON files into MongoDB..."

mongoimport --db restaurants-service --collection restaurants --jsonArray --file /docker-entrypoint-initdb.d/restaurant-service.restaurants.json
mongoimport --db restaurants-service --collection promotions --jsonArray --file /docker-entrypoint-initdb.d/restaurant-service.promotions.json
mongoimport --db restaurants-service --collection reviews --jsonArray --file /docker-entrypoint-initdb.d/restaurant-service.reviews.json

echo "Finished importing JSON data."
