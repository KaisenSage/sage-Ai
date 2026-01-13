# Sage AI - Complete Setup Instructions

This guide will walk you through setting up the Sage AI flexible commerce platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## 🚀 Step 1: Initialize Your Local Repository

```bash
# Clone your repository
git clone https://github.com/KaisenSage/sage-Ai.git
cd sage-Ai
```

## 📁 Step 2: Create the Project Structure

Run these commands to create the folder structure:

```bash
# Create apps folders
mkdir -p apps/api/src/{routes,controllers,middleware,utils,types}
mkdir -p apps/admin/src/{app,components,lib,hooks,context}
mkdir -p apps/web

# Create packages folders
mkdir -p packages/database/prisma
mkdir -p packages/types/src
mkdir -p packages/config/src
```

## 📦 Step 3: Create Root package.json

Create `package.json` in the root:

```json
{
  "name": "sage-ai",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "api": "cd apps/api && npm run dev",
    "admin": "cd apps/admin && npm run dev",
    "db:migrate": "cd packages/database && npm run db:migrate",
    "db:seed": "cd packages/database && npm run db:seed",
    "db:studio": "cd packages/database && npm run db:studio"
  },
  "devDependencies": {
    "turbo": "^1.11.0",
    "typescript": "^5.3.3"
  }
}
```

## 🚫 Step 4: Create .gitignore

Create `.gitignore` in the root:

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
.next/
out/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
packages/database/.env
```

## ⚙️ Step 5: Set Up Turborepo

Create `turbo.json` in the root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

## 🔧 Step 6: Set Up Backend API

### Create `apps/api/package.json`:

```json
{
  "name": "api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "@prisma/client": "^5.7.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.5",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

### Create `apps/api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Create `apps/api/.env.example`:

```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/sageai
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Create `apps/api/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sage AI API is running' });
});

// Routes will be added here

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
```

## 🗄️ Step 7: Set Up Database (Prisma)

### Create `packages/database/package.json`:

```json
{
  "name": "database",
  "version": "1.0.0",
  "main": "./index.ts",
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.7.1"
  },
  "devDependencies": {
    "prisma": "^5.7.1",
    "tsx": "^4.7.0"
  }
}
```

### Create `packages/database/prisma/schema.prisma`:

See the full schema in the next section below.

### Create `packages/database/.env.example`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/sageai
```

## 💾 Step 8: Database Schema

The complete Prisma schema includes these models:
- Business (multi-tenant support)
- Branch (multiple locations)
- Category (product organization)
- Product (menu items/products)
- ProductVariant (sizes, options)
- Addon (extras, toppings)
- BranchProduct (branch-specific availability)
- Customer (end users)
- CustomerAddress (delivery addresses)
- Order (customer orders)
- OrderItem (order line items)
- Staff (business staff/admins)
- Discount (promo codes)

## 🎨 Step 9: Set Up Admin Dashboard

### Create `apps/admin/package.json`:

```json
{
  "name": "admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }
}
```

### Create `apps/admin/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Create `apps/admin/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

### Create `apps/admin/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

### Create `apps/admin/.env.local.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📦 Step 10: Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm install --workspaces
```

## 🗄️ Step 11: Set Up PostgreSQL

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
```bash
createdb sageai
```

### Option 2: Cloud Database (Recommended)

Use a service like:
- [Supabase](https://supabase.com) (Free tier available)
- [Railway](https://railway.app) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)

## 🔐 Step 12: Configure Environment Variables

### Backend API:
```bash
cd apps/api
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

### Database:
```bash
cd packages/database
cp .env.example .env
# Edit .env with your database URL
```

### Admin Dashboard:
```bash
cd apps/admin
cp .env.local.example .env.local
# No changes needed for local development
```

## 🚀 Step 13: Run Database Migrations

```bash
# From root directory
cd packages/database
npm install
npm run db:generate
npm run db:migrate
```

## 🌱 Step 14: Seed the Database (Optional)

Create sample data for testing:

```bash
cd packages/database
npm run db:seed
```

## 🏃 Step 15: Start Development Servers

### Option 1: Run all services with Turbo (Recommended)
```bash
# From root directory
npm run dev
```

### Option 2: Run services individually

**Terminal 1 - Backend API:**
```bash
npm run api
# Runs on http://localhost:4000
```

**Terminal 2 - Admin Dashboard:**
```bash
npm run admin
# Runs on http://localhost:3000
```

## ✅ Step 16: Verify Setup

1. **Check API Health:**
   - Visit http://localhost:4000/health
   - Should return: `{"status": "ok", "message": "Sage AI API is running"}`

2. **Check Admin Dashboard:**
   - Visit http://localhost:3000
   - You should see the Next.js welcome page

3. **Check Database:**
   ```bash
   npm run db:studio
   ```
   - Opens Prisma Studio at http://localhost:5555
   - You can view and edit your database

## 📚 Next Steps

After setup is complete, you can:

1. **Build Authentication** - Implement login/register for staff
2. **Create API Routes** - Add CRUD endpoints for categories, products, branches
3. **Build Admin UI** - Create dashboard pages for managing content
4. **Add Product Management** - Build forms for creating products with variants and add-ons
5. **Implement Orders** - Create order management system
6. **Add Payment Integration** - Integrate Stripe or Paystack

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env files
- Ensure database exists: `createdb sageai`

### Port Already in Use
- Change PORT in `apps/api/.env`
- Change dev port for admin: `next dev -p 3001`

### TypeScript Errors
```bash
# Regenerate Prisma client
cd packages/database
npm run db:generate
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install --workspaces
```

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

This is a commercial project. Contact the repository owner for contribution guidelines.

## 📄 License

Proprietary - All rights reserved