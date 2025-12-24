import db from '../src/utils/db.ts';

async function run() {
  const queries = [
    // Servers
    "ALTER TABLE servers ALTER COLUMN id TYPE BIGINT",
    
    // User Servers
    "ALTER TABLE user_servers ALTER COLUMN server_id TYPE BIGINT",
    "ALTER TABLE user_servers ALTER COLUMN user_id TYPE BIGINT",
    
    // Shifts
    "ALTER TABLE shifts ALTER COLUMN server_id TYPE BIGINT",
    "ALTER TABLE shifts ALTER COLUMN user_id TYPE BIGINT",
    
    // Users
    "ALTER TABLE users ALTER COLUMN id TYPE BIGINT",
  ];

  console.log("Starting database schema updates to support Discord Snowflake IDs (BIGINT)...");

  for (const query of queries) {
    try {
      console.log(`Executing: ${query}`);
      await db.query(query);
      console.log("✅ Success");
    } catch (e: any) {
      // Ignore errors about objects not existing, but print others
      if (e.code === '42P01') { // undefined_table
         console.log(`ℹ️ Table not found (skipping): ${e.message}`);
      } else if (e.code === '42703') { // undefined_column
         console.log(`ℹ️ Column not found (skipping): ${e.message}`);
      } else {
         console.log(`⚠️ Error: ${e.message}`);
      }
    }
  }
  
  console.log("Finished.");
  process.exit(0);
}

run();
