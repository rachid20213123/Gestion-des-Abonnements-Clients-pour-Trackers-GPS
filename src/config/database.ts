import mysql from 'mysql2/promise';

// Configuration de la base de données
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gps_mysi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Création du pool de connexions
export const pool = mysql.createPool(dbConfig);

// Fonction utilitaire pour exécuter des requêtes
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erreur de base de données:', error);
    throw error;
  }
}