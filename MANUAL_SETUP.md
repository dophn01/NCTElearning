# Manual PostgreSQL Setup Guide

## Prerequisites
- PostgreSQL 14+ installed on your system
- psql command-line tool available

## Step 1: Create Database and User

Open Command Prompt or PowerShell as Administrator and run:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE nc_telearning;

-- Create user
CREATE USER nc_user WITH PASSWORD 'nc_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nc_telearning TO nc_user;

-- Connect to the new database
\c nc_telearning

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO nc_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nc_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nc_user;

-- Exit psql
\q
```

## Step 2: Run Schema and Seed Data

```bash
# Run the schema
psql -U nc_user -d nc_telearning -f database/schema.sql

# Run the seed data
psql -U nc_user -d nc_telearning -f database/seed.sql
```

## Step 3: Verify Setup

```bash
# Test connection
psql -U nc_user -d nc_telearning -c "SELECT COUNT(*) FROM users;"
```

You should see a count of users (should be 5 from the seed data).

## Step 4: Update Backend Environment

Make sure your `backend/.env` file has the correct database settings:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nc_telearning
DATABASE_USER=nc_user
DATABASE_PASSWORD=nc_password
```

## Step 5: Start the Application

```bash
# Start backend
cd backend
npm run start:dev

# In another terminal, start frontend
cd frontend
npm run dev
```

## Alternative: Use SQLite for Development

If you want to avoid PostgreSQL setup entirely, we can modify the backend to use SQLite for development.
