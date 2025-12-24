import db from '../src/utils/db.ts';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS server_settings (
  server_id BIGINT PRIMARY KEY REFERENCES servers(id) ON DELETE CASCADE,
  telegram_bot_token TEXT,
  telegram_chat_id TEXT,
  verification_code VARCHAR(50),
  
  -- Configuración de Alertas (Flags)
  alert_shift_start BOOLEAN DEFAULT TRUE,
  alert_shift_end BOOLEAN DEFAULT TRUE,
  alert_break_exceeded BOOLEAN DEFAULT TRUE,
  alert_missed_schedule BOOLEAN DEFAULT TRUE,
  
  -- Límites
  max_break_minutes INTEGER DEFAULT 15,
  schedule_grace_minutes INTEGER DEFAULT 10,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;

async function run() {
  try {
    console.log("Creating server_settings table...");
    await db.query(createTableQuery);
    console.log("✅ Table 'server_settings' created successfully.");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
  process.exit(0);
}

run();
