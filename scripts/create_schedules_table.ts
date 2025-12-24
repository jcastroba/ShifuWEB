import db from '../src/utils/db.ts';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS weekly_schedules (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  server_id BIGINT NOT NULL,
  day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
  start_time TIME,
  end_time TIME,
  is_rest_day BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, server_id, day_of_week)
);
`;

async function run() {
  try {
    await db.query(createTableQuery);
    console.log("Table 'weekly_schedules' created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

run();
