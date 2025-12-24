import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL no está definido. Verifica tu configuración.");
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
const db = {
  query: (text, params) => pool.query(text, params)
};

export { db as d };
