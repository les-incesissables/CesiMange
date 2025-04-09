#!/bin/bash
mongod 

mongoimport --host localhost --db restaurant-service --collection restaurants --file /docker-entrypoint-initdb.d/restaurant-service.restaurants.json
mongoimport --host localhost --db restaurant-service --collection promotions --file /docker-entrypoint-initdb.d/restaurant-service.promotions.json
mongoimport --host localhost --db restaurant-service --collection reviews --file /docker-entrypoint-initdb.d/restaurant-service.reviews.json