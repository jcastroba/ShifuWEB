    # Guía de Despliegue en Vercel

Este proyecto está configurado para ser desplegado en [Vercel](https://vercel.com/) utilizando el adaptador `@astrojs/vercel`.

## Requisitos Previos

1.  Una cuenta en Vercel.
2.  Una base de datos PostgreSQL en la nube (ej. Neon, Supabase, Vercel Postgres, Railway).
3.  Una aplicación de Discord configurada para OAuth2.

## Pasos para Desplegar

1.  **Subir el código a GitHub/GitLab/Bitbucket**.
2.  **Importar el proyecto en Vercel**:
    *   Ve a tu dashboard de Vercel y haz clic en "Add New..." -> "Project".
    *   Selecciona el repositorio de Git.
    *   Vercel detectará automáticamente que es un proyecto Astro.

3.  **Configurar Variables de Entorno**:
    En la configuración del proyecto en Vercel (Settings -> Environment Variables), añade las siguientes variables:

    | Variable | Descripción | Ejemplo |
    |Data Base|---|---|
    | `DATABASE_URL` | URL de conexión a tu base de datos PostgreSQL. | `postgres://user:pass@host:port/db?sslmode=require` |
    | **Discord Auth** | | |
    | `CLIENT_ID` | ID de cliente de tu aplicación de Discord. | `123456789012345678` |
    | `CLIENT_SECRET` | Secreto de cliente de tu aplicación de Discord. | `abcdefghijklmnopqrstuvwxyz` |
    | `DISCORD_REDIRECT_URI` | URL de callback para OAuth2. Debe coincidir con la URL de producción. | `https://tu-proyecto.vercel.app/api/auth/callback` |

4.  **Desplegar**:
    *   Haz clic en "Deploy".
    *   Vercel construirá y desplegará tu aplicación.

## Notas Importantes

*   **Base de Datos**: Asegúrate de que tu base de datos acepte conexiones externas y tenga SSL habilitado (la configuración actual lo requiere en producción).
*   **Discord OAuth**: En el portal de desarrolladores de Discord, asegúrate de añadir la URL de redirección (`https://tu-proyecto.vercel.app/api/auth/callback`) en la sección "OAuth2" -> "Redirects".
*   **Node.js Version**: Vercel suele usar Node.js 18 o 20 por defecto, lo cual es compatible.

## Scripts de Mantenimiento

La carpeta `scripts/` contiene utilidades para mantenimiento de la base de datos. Estos scripts no se ejecutan automáticamente en Vercel. Si necesitas ejecutarlos, puedes hacerlo localmente conectándote a la base de datos de producción (configurando tu `.env` local con la `DATABASE_URL` de producción) y ejecutando:

```bash
npx tsx scripts/nombre_del_script.ts
```
