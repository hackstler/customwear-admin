#!/bin/bash

# Variables
DB_NAME="test"
DB_USER="test"
DB_HOST="test-postgres-medusadatabase"
DB_PORT="5432"
DB_PASSWORD="test"
BACKUP_DIR="/path/to/backups"
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).sql"
BUCKET_NAME="customwear-store"

# Crear directorio de respaldo si no existe
mkdir -p ${BACKUP_DIR}

# Exportar la contraseña para pg_dump
export PGPASSWORD=${DB_PASSWORD}

# Hacer respaldo de la base de datos
pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} ${DB_NAME} > ${BACKUP_DIR}/${BACKUP_NAME}

# Subir el respaldo al bucket de Google Cloud Storage
gsutil cp ${BACKUP_DIR}/${BACKUP_NAME} gs://${BUCKET_NAME}/

# Opcional: Borrar respaldos locales antiguos (mantener solo los últimos 7 días)
find ${BACKUP_DIR} -type f -mtime +7 -name '*.sql' -exec rm {} \;


