.PHONY: up down start stop restart

# Lancer tous les containers en détaché
up:
	docker-compose up -d --build

# Arrêter et supprimer tous les containers
down:
	docker-compose stop
	docker-compose down -v --remove-orphans

# Démarrer les containers (si arrêtés, mais non supprimés)
start:
	docker-compose up -d
# docker-compose start

# Arrêter les containers sans les supprimer
stop:
	docker-compose stop

# Redémarrer tous les containers
restart:
	docker-compose restart
