import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkUserAdminStatus() {
  const userId = '219574960371400704';
  try {
    console.log(`Checking admin status for user: ${userId}`);
    
    const res = await pool.query(`
      SELECT us.user_id, us.server_id, us.is_admin, s.name as server_name
      FROM user_servers us
      JOIN servers s ON us.server_id = s.id
      WHERE us.user_id = $1
    `, [userId]);
    
    console.log("User servers records:", JSON.stringify(res.rows, null, 2));
    
    if (res.rows.length === 0) {
        console.log("No records found for this user in user_servers table.");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkUserAdminStatus();
