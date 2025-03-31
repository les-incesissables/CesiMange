# ----- Étape 1 : Build (dans le contexte du monorepo) -----
    FROM node:22.14-alpine AS builder
    WORKDIR /app
    
    # Copier l'intégralité du dépôt (contexte de build = racine)
    COPY . .
    
    # 1) Compiler data-access-layer
    WORKDIR /app/platforms/services/data-access-layer
    RUN npm install && npm run build
    
    # 2) Compiler base-classes
    WORKDIR /app/platforms/services/base-classes
    RUN npm install && npm run build
    
    # 3) Compiler user-service
    WORKDIR /app/platforms/microservices/user-service
    RUN npm install && npm run build
    
    # ----- Étape 2 : Image finale pour user-service -----
    FROM node:22.14-alpine
    WORKDIR /app
    
    # Copier les modules partagés en préservant la structure
    COPY --from=builder /app/platforms/services/data-access-layer /app/platforms/services/data-access-layer
    COPY --from=builder /app/platforms/services/base-classes /app/platforms/services/base-classes
    
    # Copier le microservice complet (y compris dist, package.json, etc.)
    COPY --from=builder /app/platforms/microservices/user-service /app/platforms/microservices/user-service
    
    # Se positionner dans le dossier du user-service
    WORKDIR /app/platforms/microservices/user-service
    
    # Installer uniquement les dépendances de production
    RUN npm install --production
    
    EXPOSE 4002
    CMD ["node", "dist/app.js"]
    