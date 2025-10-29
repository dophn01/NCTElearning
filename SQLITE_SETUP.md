# SQLite Development Setup

## Quick Start with SQLite

If you're having Docker issues, you can use SQLite for development:

### 1. Update Backend Environment

Create `backend/.env` with SQLite configuration:

```bash
# SQLite Configuration (for development)
DATABASE_TYPE=sqlite
DATABASE_NAME=database.sqlite
DATABASE_SYNCHRONIZE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 2. Update Database Module

The database module will automatically use SQLite when configured.

### 3. Start the Application

```bash
# Start backend
cd backend
npm run start:dev

# In another terminal, start frontend
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

### 5. Default Accounts (will be created automatically)

- **Admin**: admin@nc-telearning.com / password123
- **Student**: student1@nc-telearning.com / password123

## Benefits of SQLite Setup

- ✅ No Docker required
- ✅ No PostgreSQL installation needed
- ✅ Database file created automatically
- ✅ Perfect for development and testing
- ✅ Easy to reset by deleting database.sqlite file

## Production Note

For production, you should still use PostgreSQL for better performance and concurrent access.
