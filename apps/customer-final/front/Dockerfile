# ----------------------
# Étape 1 : Build
# ----------------------
    FROM node:latest as builder

    # Crée un répertoire de travail
    WORKDIR /app
    
    # Copie les fichiers de configuration (package.json, package-lock.json, yarn.lock, etc.)
    COPY package*.json ./
    
    # Installe les dépendances
    RUN npm install
    
    # Copie le reste du code source
    COPY . .
    
    # Compile l'application (assure-toi que "build" est défini dans package.json)
    RUN npm run build
    
    # ----------------------
    # Étape 2 : Serveur Nginx
    # ----------------------
    FROM nginx:alpine
    
    # Copie les fichiers compilés depuis l'étape builder vers le répertoire de Nginx
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Expose le port 80 pour le container
    EXPOSE 80
    
    # Lance Nginx en foreground
    CMD ["nginx", "-g", "daemon off;"]
    