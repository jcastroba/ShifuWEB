import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import dotenv from 'dotenv';
import vercel from '@astrojs/vercel/serverless';

// Cargar variables de entorno desde .env
dotenv.config();

export default defineConfig({
  integrations: [
    tailwind(), 
    react()
  ],
  output: 'server',
  adapter: vercel(),
});

