import db from '../src/utils/db.ts';

const alterUsersQuery = `
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
`;

const alterServersQuery = `
ALTER TABLE servers 
ADD COLUMN IF NOT EXISTS icon_url TEXT;
`;

async function run() {
  try {
    await db.query(alterUsersQuery);
    console.log("Added avatar_url to users table.");
    
    await db.query(alterServersQuery);
    console.log("Added icon_url to servers table.");
  } catch (err) {
    console.error("Error altering tables:", err);
  }
}

run();
