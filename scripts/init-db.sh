#!/bin/bash

# Variables
DB_HOST="votre_host_mysql"
DB_USER="votre_utilisateur"
DB_PASSWORD="votre_mot_de_passe"
DB_NAME="gps_mysi"

# Création de la base de données
echo "Création de la base de données..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import du schéma
echo "Import du schéma de la base de données..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < ./database/schema.sql

echo "Initialisation de la base de données terminée !"