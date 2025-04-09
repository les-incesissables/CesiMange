#!/bin/bash

# Démarrer MongoDB en arrière-plan avec journalisation détaillée
mongod --bind_ip_all --fork --logpath /var/log/mongod.log --setParameter enableLocalhostAuthBypass=1

sleep 10

# Importer les données avec journalisation
echo "Début de l'import des données..."
mongoimport --host 127.0.0.1 --db user-service --collection user_profiles --file /docker-entrypoint-initdb.d/user-service.user_profiles.json --jsonArray --verbose

# Arrêt propre et redémarrage en foreground
echo "Redémarrage en mode persistant..."
mongod --shutdown
exec mongod --bind_ip_all