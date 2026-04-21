# Guía de Inicio Rápido - Sabores de Esperanza

## 🚀 Pasos de Configuración

### 1. Requisitos Previos
- Node.js 18+ instalado
- Docker Desktop instalado
- Git instalado
- Cuenta de Google Cloud (para Google Maps API)

### 2. Clonar o Crear el Proyecto

```bash
# Crear nuevo proyecto Next.js
npx create-next-app@latest sabores-de-esperanza --typescript --tailwind --app

cd sabores-de-esperanza
```

### 3. Instalar Dependencias

```bash
npm install

# Dependencias principales
npm install prisma @prisma/client
npm install next-auth
npm install @react-google-maps/api google-map-react
npm install react-query zustand
npm install recharts
npm install zod react-hook-form
npm install framer-motion
npm install nodemailer
npm install dotenv

# Dependencias de desarrollo
npm install -D typescript @types/node @types/react
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint prettier
npm install -D jest @testing-library/react
npm install -D husky lint-staged
```

### 4. Levantar la Base de Datos

```bash
# En la raíz del proyecto, asegúrate de tener docker-compose.yml
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps
```

**Acceso a las herramientas:**
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- PgAdmin: http://localhost:5050
  - Email: admin@saboresdeesperanza.com
  - Contraseña: admin123

### 5. Configurar Variables de Entorno

Crea archivo `.env.local`:

```
# Database
DATABASE_URL="postgresql://sabores:esperanza2024@localhost:5432/sabores_db"

# NextAuth
NEXTAUTH_SECRET="tu_secreto_generado_con_openssl"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu_clave_api_de_google"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu_email@gmail.com"
SMTP_PASS="tu_contraseña_app"

# Vercel
VERCEL_ENV="development"
```

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 6. Configurar Prisma

Crea o actualiza `prisma/schema.prisma` con el contenido proporcionado.

```bash
# Crear primera migración
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Abrir Prisma Studio (UI para ver la BD)
npx prisma studio
```

### 7. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

### 8. Estructura del Proyecto

```
sabores-de-esperanza/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── registro/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── donadoras/page.tsx
│   │   ├── beneficiadas/page.tsx
│   │   └── donaciones/page.tsx
│   ├── api/auth/[...nextauth]/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/Button.tsx
│   ├── forms/EmpresaForm.tsx
│   └── maps/MapaIntegrativo.tsx
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── lib/
│   ├── auth.ts
│   └── prisma.ts
├── types/
│   └── index.ts
├── public/
├── .env.local
├── docker-compose.yml
└── package.json
```

---

## 📖 Próximos Pasos

1. ✅ Instalar dependencias
2. ✅ Configurar Docker
3. ✅ Configurar variables de entorno
4. ✅ Configurar Prisma
5. ⭕ Crear esquema de base de datos
6. ⭕ Implementar autenticación
7. ⭕ Crear componentes UI
8. ⭕ Integrar Google Maps
9. ⭕ Desplegar en Vercel

---

## 🐛 Solución de Problemas

### Puerto 5432 ya está en uso
```bash
# Cambiar puerto en docker-compose.yml
# De "5432:5432" a "5433:5432"
docker-compose down
docker-compose up -d
```

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs
docker-compose logs postgres
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose down -v
docker-compose up -d
npx prisma migrate reset
```

---

## 💾 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor desarrollo
npm run build        # Build para producción
npm start            # Inicia servidor producción

# Base de datos
npx prisma studio   # Abre interfaz gráfica
npx prisma migrate dev --name nombre_migracion
npx prisma db push
npx prisma db seed

# Testing
npm test             # Ejecutar tests

# Linting
npm run lint         # ESLint
npm run format       # Prettier

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f
```

---

## 🌐 Obtener Google Maps API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita estas APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Crea una clave de API
5. Restringe la clave a aplicaciones web
6. Añade dominios: localhost:3000, tu-dominio.com
7. Copia la clave en `.env.local`

---

## 📱 Paleta de Colores para Tailwind

Añade a `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        'sabores-verde-oscuro': '#2D5016',
        'sabores-verde-medio': '#6B9F3F',
        'sabores-verde-claro': '#A8D08D',
        'sabores-beige': '#F5E6D3',
        'sabores-beige-claro': '#FAF7F2',
        'sabores-marron': '#D4A574',
      },
    },
  },
}
```

---

¡Listo! Ahora puedes empezar a desarrollar tu aplicación. 🚀
