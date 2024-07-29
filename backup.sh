#!/bin/bash

# Variables
DB_NAME="medusadatabase"
DB_USER="postgres"
DB_PORT="5432"
DB_PASSWORD="62af8ce840afc56aca8fe44a0289f982"
BACKUP_DIR="/home/sergio/backups"
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).sql"
BUCKET_NAME="customwear-store"
CONTAINER_NAME="dokku.postgres.medusadatabase"

# Crear directorio de respaldo si no existe
mkdir -p ${BACKUP_DIR}

# Exportar la contraseña para pg_dump
export PGPASSWORD=${DB_PASSWORD}

# Hacer respaldo de la base de datos desde dentro del contenedor PostgreSQL
sudo docker exec ${CONTAINER_NAME} pg_dump -U ${DB_USER} -d ${DB_NAME} > ${BACKUP_DIR}/${BACKUP_NAME}

# Subir el respaldo al bucket de Google Cloud Storage
sudo gsutil cp ${BACKUP_DIR}/${BACKUP_NAME} gs://${BUCKET_NAME}/

# Opcional: Borrar respaldos locales antiguos (mantener solo los últimos 7 días)
find ${BACKUP_DIR} -type f -mtime +7 -name '*.sql' -exec rm {} \;