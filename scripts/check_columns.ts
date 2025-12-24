import db from '../src/utils/db.ts';

async function run() {
  try {
    const res = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log("Columns in 'users' table:", res.rows);
    
    const resServers = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'servers';
    `);
    console.log("Columns in 'servers' table:", resServers.rows);

  } catch (err) {
    console.error("Error:", err);
  }
}

run();
