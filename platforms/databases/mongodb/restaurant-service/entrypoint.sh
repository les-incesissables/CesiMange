#!/bin/bash

# Redémarrer en mode foreground pour garder le conteneur actif
exec mongod --bind_ip_all

# Attendre que MongoDB soit vraiment prêt
sleep 5  # Attente initiale pour le démarrage
until mongo --eval "db.adminCommand({ping: 1})" >/dev/null 2>&1; do
    echo "En attente de MongoDB..."
    sleep 2
done

# Importer les données
mongoimport --host localhost --db restaurant-service --collection restaurants --file /docker-entrypoint-initdb.d/restaurant-service.restaurants.json
mongoimport --host localhost --db restaurant-service --collection promotions --file /docker-entrypoint-initdb.d/restaurant-service.promotions.json
mongoimport --host localhost --db restaurant-service --collection reviews --file /docker-entrypoint-initdb.d/restaurant-service.reviews.json

