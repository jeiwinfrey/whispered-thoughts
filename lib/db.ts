import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Jeiwin0612',
  database: 'whispered_thoughts',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function createConnection() {
  return await pool.getConnection();
}
