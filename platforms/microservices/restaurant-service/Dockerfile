# ----- Étape 1 : Build -----
    FROM node:22.14-alpine AS builder
    WORKDIR /app
    
    # Copier l'intégralité du dépôt
    COPY . .
    
    # 1) Compiler data-access-layer
    WORKDIR /app/platforms/services/data-access-layer
    RUN npm install && npm run build
    
    # 2) Compiler base-classes
    WORKDIR /app/platforms/services/base-classes
    RUN npm install && npm run build
    
    # 3) Compiler restaurant-service
    WORKDIR /app/platforms/microservices/restaurant-service
    RUN npm install && npm run build
    
    # ----- Étape 2 : Image finale pour restaurant-service -----
    FROM node:22.14-alpine
    WORKDIR /app
    
    # Copier les modules partagés en préservant la structure
    COPY --from=builder /app/platforms/services/data-access-layer /app/platforms/services/data-access-layer
    COPY --from=builder /app/platforms/services/base-classes /app/platforms/services/base-classes
    
    # Copier le restaurant-service complet
    COPY --from=builder /app/platforms/microservices/restaurant-service /app/platforms/microservices/restaurant-service
    
    # Se positionner dans le dossier du restaurant-service
    WORKDIR /app/platforms/microservices/restaurant-service
    
    # Installer uniquement les dépendances de production
    RUN npm install --production
    
    EXPOSE 4003
    CMD ["node", "dist/app.js"]
    