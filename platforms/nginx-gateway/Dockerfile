# Étape 1 : Utiliser l'image stable de NGINX
FROM nginx:stable-alpine

# Étape 2 : Supprimer la config par défaut si elle existe
RUN rm -f /etc/nginx/conf.d/default.conf

# Étape 3 : Copier ta configuration personnalisée nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Étape 4 : Ajouter un dossier pour logs (optionnel si tu veux les sortir proprement)
RUN mkdir -p /var/log/nginx

# Étape 5 : Exposer le port utilisé par ton gateway (ici 80)
EXPOSE 80 443

# Étape 6 : CMD par défaut (inclus déjà dans l’image NGINX, mais on le laisse ici pour clarté)
CMD ["nginx", "-g", "daemon off;"]
