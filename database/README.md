# Database Setup for NC Telearning

This directory contains PostgreSQL database configuration and schema files for the e-learning platform.

## Prerequisites

1. Install PostgreSQL (version 14 or higher)
2. Install pgAdmin4 for database management
3. Ensure PostgreSQL service is running

## Database Configuration

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: nc_telearning
- **Username**: nc_user
- **Password**: nc_password

### pgAdmin4 Setup
- **URL**: http://localhost:5050
- **Default Email**: admin@nc-telearning.com
- **Default Password**: admin123

## Schema Overview

The database includes the following main tables:

1. **users** - User accounts (students and teachers)
2. **roles** - User roles (admin/teacher, user/student)
3. **courses** - Course information
4. **lessons** - Individual lessons within courses
5. **videos** - Video content for lessons
6. **quizzes** - Practice quizzes
7. **quiz_questions** - Individual quiz questions
8. **quiz_attempts** - Student quiz attempts
9. **essay_exercises** - Essay writing exercises
10. **essay_submissions** - Student essay submissions

## Setup Instructions

1. Create the database:
   ```sql
   CREATE DATABASE nc_telearning;
   CREATE USER nc_user WITH PASSWORD 'nc_password';
   GRANT ALL PRIVILEGES ON DATABASE nc_telearning TO nc_user;
   ```

2. Run the initial schema:
   ```bash
   psql -U nc_user -d nc_telearning -f schema.sql
   ```

3. Seed initial data:
   ```bash
   psql -U nc_user -d nc_telearning -f seed.sql
   ```

## Environment Variables

Add these to your backend `.env` file:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nc_telearning
DATABASE_USER=nc_user
DATABASE_PASSWORD=nc_password
```
