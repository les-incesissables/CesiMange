#!/usr/bin/env bash
# entrypoint.sh

# Démarrer SQL Server en tâche de fond
/opt/mssql/bin/sqlservr &

# Attendre que SQL Server soit prêt (ajuster le délai si nécessaire)
echo "Waiting for SQL Server to start..."
sleep 20

# Exécuter tous les scripts .sql présents dans /init-sql
for f in /init-sql/*.sql
do
  if [ -f "$f" ]; then
    echo "Running seed script: $f"
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i "$f"
  fi
done

# Attendre le processus SQL Server pour que le container ne se termine pas
wait
