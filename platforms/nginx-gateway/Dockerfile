# Étape 1 : On part d'une image Nginx légère
FROM nginx:stable-alpine

# Étape 2 : Supprimer la config par défaut
RUN rm -f /etc/nginx/conf.d/default.conf

# Étape 3 : Copier ta configuration personnalisée
COPY platforms/nginx-gateway/nginx.conf /etc/nginx/nginx.conf

# Étape 4 : (Optionnel) Créer un dossier logs (souvent géré par l'image Nginx)
RUN mkdir -p /var/log/nginx

# Étape 5 : Exposer le port 80
EXPOSE 80

# Étape 6 : Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]

