# ===== Stage 1 : Builder =====
FROM node:22.14-alpine AS builder
WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY platforms/microservices/request-resolver-service/package*.json platforms/microservices/request-resolver-service/

# Installer et compiler le service request-resolver-service
WORKDIR /app/platforms/microservices/request-resolver-service
RUN npm install && npm run build

# ===== Stage 2 : Image finale pour la production =====
FROM node:22.14-alpine
WORKDIR /app

# Copier uniquement les artefacts buildés (généralement dans dist)
COPY --from=builder /app/platforms/microservices/request-resolver-service/dist platforms/microservices/request-resolver-service/dist
COPY --from=builder /app/platforms/microservices/request-resolver-service/package*.json platforms/microservices/request-resolver-service/

WORKDIR /app/platforms/microservices/request-resolver-service
RUN npm install --production

EXPOSE 8080
CMD ["node", "dist/index.js"]
