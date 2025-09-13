const mysql = require("mysql2/promise");
require("dotenv/config");

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "vetcontrol",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

async function ensureDbConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(
      `Conexión a MySQL exitosa → ${process.env.DB_HOST}:${process.env.DB_PORT} / ${process.env.DB_NAME}`
    );
  } catch (err) {
    console.error("Error conectando a MySQL:", err.code, err.message);
    throw err;
  }
}

module.exports = { pool, ensureDbConnection };
