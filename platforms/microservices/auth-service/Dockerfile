# ===== Stage 1: Builder =====
FROM node:22.14-alpine AS builder
WORKDIR /app/

# 1. Copy ONLY dependency files (package.json + lockfiles)
COPY platforms/services/base-classes/package*.json platforms/services/base-classes/
COPY platforms/services/data-access-layer/package*.json platforms/services/data-access-layer/
COPY platforms/services/message-broker-service/package*.json platforms/services/message-broker-service/
COPY platforms/microservices/auth-service/package*.json platforms/microservices/auth-service/

# 2. Install dependencies (cached unless package.json changes)
WORKDIR /app/platforms/services/base-classes/
RUN npm install

WORKDIR /app/platforms/services/data-access-layer/
RUN npm install

WORKDIR /app/platforms/services/message-broker-service/
RUN npm install

WORKDIR /app/platforms/microservices/auth-service/
RUN npm install

WORKDIR /app/

# 3. Copy ONLY build-config files (tsconfig.json, etc.)
COPY platforms/services/base-classes/tsconfig*.json platforms/services/base-classes/
COPY platforms/services/data-access-layer/tsconfig*.json platforms/services/data-access-layer/
COPY platforms/services/message-broker-service/tsconfig*.json platforms/services/message-broker-service/
COPY platforms/microservices/auth-service/tsconfig*.json platforms/microservices/auth-service/

# 4. Copy ONLY source code (src/) for each service
COPY platforms/services/base-classes/src/ platforms/services/base-classes/src/
COPY platforms/services/data-access-layer/src/ platforms/services/data-access-layer/src/
COPY platforms/services/message-broker-service/src/ platforms/services/message-broker-service/src/
COPY platforms/microservices/auth-service/src/ platforms/microservices/auth-service/src/

# 5. Build all services
WORKDIR /app/platforms/services/base-classes/
RUN npm run build

WORKDIR /app/platforms/services/data-access-layer/
RUN npm run build

WORKDIR /app/platforms/services/message-broker-service/
RUN npm run build

WORKDIR /app/platforms/microservices/auth-service/
RUN npm run build

# ===== Stage 2: Production Image =====
FROM node:22.14-alpine
WORKDIR /app/

# Copy ONLY built artifacts (dist/) and production deps
COPY --from=builder /app/platforms/services/base-classes/dist/ platforms/services/base-classes/dist/
COPY --from=builder /app/platforms/services/data-access-layer/dist/ platforms/services/data-access-layer/dist/
COPY --from=builder /app/platforms/services/message-broker-service/dist/ platforms/services/message-broker-service/dist/
COPY --from=builder /app/platforms/microservices/auth-service/dist/ platforms/microservices/auth-service/dist/
COPY --from=builder /app/platforms/microservices/auth-service/package*.json platforms/microservices/auth-service/

WORKDIR /app/platforms/microservices/auth-service/
RUN npm install --production

EXPOSE 4001
CMD ["node", "dist/app.js"]
