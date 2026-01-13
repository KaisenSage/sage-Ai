# Sage AI - Flexible Commerce Platform

A modern, scalable commerce platform for restaurants, cafés, and retail businesses. Built with a monorepo architecture using TypeScript, Next.js, Express, and Prisma.

## 🚀 Features

- **Multi-tenant Support** - Each business operates independently with its own data
- **Multi-branch Operations** - Support for multiple locations per business
- **Menu/Product Management** - Organize products in categories with variants and add-ons
- **Order Management** - Support for dine-in, pickup, delivery, and walk-in orders
- **Real-time Availability** - Branch-specific product availability and pricing
- **Role-based Access Control** - Owner, Admin, Manager, and Staff roles
- **Discount System** - Promotional codes and campaigns
- **Responsive Admin Dashboard** - Built with Next.js and Tailwind CSS

## 📁 Project Structure

```
sage-Ai/
├── apps/
│   ├── api/              # Node.js/Express backend
│   ├── admin/            # Next.js admin dashboard
│   └── web/              # Next.js customer-facing app (placeholder)
├── packages/
│   ├── database/         # Prisma schema and client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
├── .gitignore
├── package.json          # Root package.json with workspaces
├── turbo.json            # Turborepo configuration
└── README.md
```

## 🛠 Tech Stack

### Backend API
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Admin Dashboard
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- Zustand for state management

### Database
- PostgreSQL
- Prisma ORM
- Multi-tenant architecture

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KaisenSage/sage-Ai.git
cd sage-Ai
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces.

### 3. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL
```bash
createdb sageai
```

#### Option B: Cloud Database (Recommended)
Use a service like [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech) and get your connection string.

### 4. Configure Environment Variables

#### Backend API:
```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env`:
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/sageai
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### Database:
```bash
cd packages/database
cp .env.example .env
```

Edit `packages/database/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sageai
```

#### Admin Dashboard:
```bash
cd apps/admin
cp .env.local.example .env.local
```

The default values in `.env.local.example` work for local development.

### 5. Generate Prisma Client and Run Migrations

```bash
# From root directory
npm run db:generate
npm run db:migrate
```

When prompted, name your migration (e.g., "init").

### 6. Seed the Database

```bash
npm run db:seed
```

This creates sample data including:
- A business: "Sage Coffee & Bistro"
- Admin user: `admin@sagecoffee.com` / `password123`
- 2 branches (Downtown and Airport)
- 3 categories (Coffee, Pastries, Sandwiches)
- 10 sample products with variants and add-ons
- Sample customer: `customer@example.com` / `customer123`

### 7. Start Development Servers

#### Option 1: Run all services with Turbo (Recommended)
```bash
npm run dev
```

#### Option 2: Run services individually

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

### 8. Access the Application

- **API Health Check**: http://localhost:4000/health
- **Admin Dashboard**: http://localhost:3000
- **Prisma Studio**: `npm run db:studio` (opens at http://localhost:5555)

## 🔐 Default Credentials

After seeding the database, use these credentials to log in:

**Admin:**
- Email: `admin@sagecoffee.com`
- Password: `password123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new business and owner account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create a product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Branches
- `GET /api/branches` - List all branches
- `POST /api/branches` - Create a branch
- `PUT /api/branches/:id` - Update a branch

All protected endpoints require the `Authorization: Bearer <token>` header.

## 🗄️ Database Schema

The database includes the following main models:

- **Business** - Multi-tenant support
- **Branch** - Multiple locations per business
- **Category** - Product organization
- **Product** - Menu items with variants and add-ons
- **ProductVariant** - Size options (Small/Medium/Large)
- **Addon** - Extras and toppings
- **BranchProduct** - Branch-specific availability
- **Customer** - End users
- **Order** - Customer orders with items
- **Staff** - Business staff and admins
- **Discount** - Promotional codes

See `packages/database/prisma/schema.prisma` for the complete schema.

## 📝 Available Scripts

### Root
- `npm run dev` - Run all apps in development mode
- `npm run build` - Build all apps
- `npm run api` - Run API server only
- `npm run admin` - Run admin dashboard only
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

### Apps/API
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Apps/Admin
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` files
- Ensure the database exists: `createdb sageai`

### Port Already in Use
- Change `PORT` in `apps/api/.env`
- Change admin port: `next dev -p 3001`

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
npm install
```

### Prisma Migration Issues
```bash
# Reset database (WARNING: This deletes all data)
cd packages/database
npx prisma migrate reset
npm run db:seed
```

## 🔮 Future Roadmap

- [ ] Customer-facing web app for ordering
- [ ] QR code ordering system
- [ ] Real-time order tracking
- [ ] Payment integration (Stripe/Paystack)
- [ ] SMS/Email notifications
- [ ] Inventory management
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced discount rules

## 🤝 Contributing

This is a commercial project. Contact the repository owner for contribution guidelines.

## 📄 License

Proprietary - All rights reserved

## 📧 Contact

For questions or support, please contact the repository owner.

---

Built with ❤️ by the Sage AI team
