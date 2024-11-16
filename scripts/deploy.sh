#!/bin/bash

# Variables
DB_HOST="votre_host_mysql"
DB_USER="votre_utilisateur"
DB_PASSWORD="votre_mot_de_passe"
DB_NAME="gps_mysi"
BACKUP_DIR="./backups"

# Créer le répertoire de backup s'il n'existe pas
mkdir -p $BACKUP_DIR

# Date pour le nom du fichier
DATE=$(date +"%Y%m%d_%H%M%S")

# Backup de la base de données
echo "Création du backup de la base de données..."
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Construction du projet
echo "Construction du projet..."
npm run build

# Déploiement des fichiers (à adapter selon votre configuration Hostinger)
echo "Déploiement des fichiers..."
# Exemple avec rsync :
# rsync -avz --delete ./dist/ user@your-hostinger-server:/path/to/public_html/

echo "Déploiement terminé !"