#!/bin/bash

# Démarrer MongoDB en arrière-plan avec journalisation détaillée
mongod --bind_ip_all --fork --logpath /var/log/mongod.log --setParameter enableLocalhostAuthBypass=1

sleep 10

# Importer les données avec journalisation
echo "Début de l'import des données..."
mongoimport --host 127.0.0.1 --db restaurant-service --collection restaurants \
    --file /docker-entrypoint-initdb.d/restaurant-service.restaurants.json --jsonArray --verbose

mongoimport --host 127.0.0.1 --db restaurant-service --collection promotions \
    --file /docker-entrypoint-initdb.d/restaurant-service.promotions.json --jsonArray --verbose

mongoimport --host 127.0.0.1 --db restaurant-service --collection reviews \
    --file /docker-entrypoint-initdb.d/restaurant-service.reviews.json --jsonArray --verbose

# Arrêt propre et redémarrage en foreground
echo "Redémarrage en mode persistant..."
mongod --shutdown
exec mongod --bind_ip_all