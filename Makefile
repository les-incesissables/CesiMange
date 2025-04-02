

.PHONY: prepare-sqlserver-volumes up-dev up-prod up-staging down start stop restart



up-dev: prepare-sqlserver-volumes
	@echo "🔧 Lancement de l'environnement de Développement..."
	docker-compose -f docker-compose.dev.yml up -d --build

up-prod: prepare-sqlserver-volumes
	@echo "🚀 Lancement de l'environnement de Production..."
	docker-compose -f docker-compose.prod.yml up -d --build

up-staging: prepare-sqlserver-volumes
	@echo "🔬 Lancement de l'environnement de Staging..."
	docker-compose -f docker-compose.staging.yml up -d --build

down:
	@echo "🛑 Arrêt et suppression de Dev, Prod et Staging..."
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker-compose -f docker-compose.prod.yml down -v --remove-orphans
	docker-compose -f docker-compose.staging.yml down -v --remove-orphans

start:
	@echo "▶️  Start containers (prod)..."
	docker-compose -f docker-compose.prod.yml start

stop:
	@echo "⏸  Stop containers (prod)..."
	docker-compose -f docker-compose.prod.yml stop

restart:
	@echo "🔄 Restart containers (prod)..."
	docker-compose -f docker-compose.prod.yml restart

rebuild-sqlserver:
	docker-compose -f docker-compose.dev.yml stop sqlserver-db
	docker-compose -f docker-compose.dev.yml rm -f sqlserver-db
	docker-compose -f docker-compose.dev.yml up -d sqlserver-db

rebuild-user-service:
	docker-compose -f docker-compose.dev.yml stop user-service
	docker-compose -f docker-compose.dev.yml rm -f user-service
	docker-compose -f docker-compose.dev.yml up -d user-service
