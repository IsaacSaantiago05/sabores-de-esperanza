# Guía de Despliegue en Vercel - Sabores de Esperanza

## 🚀 Paso 1: Preparar el Repositorio

### 1.1 Inicializar Git
```bash
cd sabores-de-esperanza
git init
git add .
git commit -m "Initial commit: Sabores de Esperanza application"
```

### 1.2 Crear Repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en "New repository"
3. Nombre: `sabores-de-esperanza`
4. Selecciona "Private" para privacidad
5. Copia los comandos para añadir el repositorio remoto:

```bash
git branch -M main
git remote add origin https://github.com/tu_usuario/sabores-de-esperanza.git
git push -u origin main
```

---

## 🌐 Paso 2: Configurar Base de Datos en la Nube

### Opción A: Supabase (Recomendado - PostgreSQL gratuito)

1. Ve a [Supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub
4. Crea un nuevo proyecto:
   - **Project name**: sabores-de-esperanza
   - **Database password**: crea uno seguro
   - **Region**: Selecciona la más cercana a tu ubicación (ej: Sudamérica)
5. Espera a que se cree (5-10 minutos)

#### Obtener credenciales:
1. Ve a "Settings" → "Database"
2. Copia la "URI": `postgresql://[user]:[password]@[host]:[port]/[database]`
3. Guarda este valor

### Opción B: Railway.app

1. Ve a [Railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Crea nuevo proyecto
4. Selecciona "PostgreSQL"
5. Obtén la URI de conexión

### Opción C: Render

1. Ve a [Render.com](https://render.com)
2. Crea nuevo PostgreSQL database
3. Selecciona plan gratuito
4. Copia la conexión externa URI

---

## 🔗 Paso 3: Desplegar en Vercel

### 3.1 Conectar GitHub a Vercel

1. Ve a [Vercel.com](https://vercel.com)
2. Haz clic en "Sign up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel

### 3.2 Crear Proyecto en Vercel

1. En el dashboard, haz clic en "New Project"
2. Importa tu repositorio `sabores-de-esperanza`
3. Configura el proyecto:

```
Framework Preset: Next.js
Root Directory: ./
```

### 3.3 Configurar Variables de Entorno

En la sección "Environment Variables" de Vercel, añade:

```
DATABASE_URL = postgresql://user:password@host:port/database
NEXTAUTH_SECRET = [genera con: openssl rand -base64 32]
NEXTAUTH_URL = https://tu-dominio.vercel.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = tu_clave_de_google_maps
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = tu_email@gmail.com
SMTP_PASS = tu_contraseña_app_gmail
```

**Para obtener NEXTAUTH_SECRET en Windows:**
```powershell
# En PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

---

## 🗄️ Paso 4: Configurar Prisma para Producción

### 4.1 Actualizar package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### 4.2 Crear script de migraciones

Crea archivo `scripts/migrate-deploy.js`:

```javascript
const { spawn } = require('child_process');

const prisma = spawn('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  shell: true,
});

prisma.on('error', (error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

prisma.on('close', (code) => {
  process.exit(code);
});
```

### 4.3 Actualizar vercel.json

Crea archivo `vercel.json`:

```json
{
  "buildCommand": "npm run build && npx prisma migrate deploy",
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

---

## 🔑 Paso 5: Obtener Google Maps API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com)

2. **Crear Proyecto:**
   - Haz clic en el selector de proyectos
   - Clic en "NEW PROJECT"
   - Nombre: "Sabores de Esperanza"
   - Clic en "CREATE"

3. **Habilitar APIs:**
   - Ve a "APIs & Services" → "Library"
   - Busca y habilita:
     - Maps JavaScript API
     - Places API
     - Geocoding API
     - Distance Matrix API

4. **Crear Credenciales:**
   - Ve a "Credentials"
   - Clic en "Create Credentials" → "API Key"
   - Copia la clave
   - Haz clic en la clave para editarla

5. **Restringir la Clave:**
   - **Application restrictions:** "HTTP referrers (web sites)"
   - Añade:
     ```
     https://sabores-de-esperanza.vercel.app
     https://*.sabores-de-esperanza.com
     ```
   - **API restrictions:** Selecciona solo las 3 APIs habilitadas

6. Guarda y copia tu API key a Vercel

---

## 📧 Paso 6: Configurar Email (Gmail)

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Selecciona "Security"
3. Busca "App passwords"
4. Selecciona "Mail" y "Windows Computer"
5. Copia la contraseña generada
6. Usa esta contraseña en `SMTP_PASS` en Vercel

---

## ✅ Paso 7: Desplegar

### 7.1 Push a GitHub

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 7.2 Deploy en Vercel

Vercel desplegará automáticamente cuando hagas push a `main`.

Para ver el progreso:
1. Ve a tu proyecto en Vercel
2. Ve a "Deployments"
3. Espera a que se complete

---

## 🧪 Paso 8: Verificar Despliegue

1. Abre tu URL de Vercel (ej: https://sabores-de-esperanza.vercel.app)
2. Prueba las siguientes funciones:
   - ✅ Página de inicio carga
   - ✅ Registro de usuarios
   - ✅ Login
   - ✅ Creación de empresa
   - ✅ Mapa carga correctamente
   - ✅ Base de datos guarda registros

---

## 🔍 Solución de Problemas

### Error: "DATABASE_URL is missing"
- Verifica que `DATABASE_URL` esté en Variables de Entorno en Vercel
- Reconstruye el proyecto

### Error: "Prisma client not generated"
- Asegúrate de que `postinstall` está en package.json
- En Vercel, ve a "Settings" → "Build & Deployment" y reconstruye

### Error: "Google Maps not loading"
- Verifica `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está correcto
- Comprueba que los referrers están autorizados en Google Cloud
- Espera 5-10 minutos para que Google procese los cambios

### Email no funciona
- Verifica `SMTP_USER` y `SMTP_PASS` son correctos
- Si usas Gmail, debe ser contraseña de app, no contraseña regular
- Comprueba que "Acceso de aplicaciones menos seguras" esté habilitado

### Lentitud en producción
- Verifica que estés en el plan correcto de Supabase
- Añade índices en base de datos (ya incluidos en Prisma schema)
- Activa caché en Vercel

---

## 📊 Monitoreo

### Vercel Analytics
1. Ve a "Analytics" en tu proyecto Vercel
2. Monitorea Core Web Vitals
3. Objetivo: LCP < 2.5s, CLS < 0.1, FID < 100ms

### Logs
```bash
# Ver logs en tiempo real
vercel logs sabores-de-esperanza
```

---

## 🎯 Dominio Personalizado

1. En Vercel, ve a "Settings" → "Domains"
2. Añade tu dominio (ej: saboresdeesperanza.com)
3. Sigue las instrucciones para configurar DNS
4. Activa SSL automático
5. Espera propagación DNS (hasta 24 horas)

---

## 🔒 Seguridad en Producción

- ✅ HTTPS obligatorio (Vercel lo hace por defecto)
- ✅ Environment variables protegidas
- ✅ CORS correctamente configurado
- ✅ Rate limiting en APIs
- ✅ Validación en servidor (no solo cliente)
- ✅ SQL injection prevenida (Prisma)
- ✅ XSS prevenido (Next.js CSP)

---

## 📱 Próximos Pasos

1. Configurar CI/CD automático
2. Configurar backups automáticos de base de datos
3. Agregar monitoreo de errores (Sentry)
4. Implementar logs centralizados
5. Configurar alertas
6. Plan de escalabilidad

---

¡Tu aplicación está lista para producción! 🎉
