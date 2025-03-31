.PHONY: up-prod up-dev up-staging down start stop restart

# Lancer l'environnement de Production : microservices et API gateway
up-prod:
	docker-compose -f docker-compose.prod.yml up -d --build

# Lancer l'environnement de Développement : microservices et API gateway
up-dev:
	docker-compose -f docker-compose.dev.yml up -d --build

# Lancer l'environnement de Staging : microservices et API gateway
up-staging:
	docker-compose -f docker-compose.staging.yml up -d --build

# Arrêter et supprimer tous les containers, réseaux et volumes pour tous les environnements
down:
	@echo "Arrêt et suppression des environnements..."
	docker-compose -f docker-compose.prod.yml down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker-compose -f docker-compose.staging.yml down -v --remove-orphans

# Démarrer les containers si arrêtés (en Production)
start:
	docker-compose -f docker-compose.prod.yml start

# Arrêter les containers sans les supprimer (en Production)
stop:
	docker-compose -f docker-compose.prod.yml stop

# Redémarrer tous les containers (en Production)
restart:
	docker-compose -f docker-compose.prod.yml restart
