# NC Telearning - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Docker (optional, for database)

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL and pgAdmin4
docker-compose up -d

# Database will be automatically created with sample data
```

#### Option B: Manual Setup
```bash
# Create database
createdb nc_telearning

# Create user
psql -c "CREATE USER nc_user WITH PASSWORD 'nc_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE nc_telearning TO nc_user;"

# Run schema and seed data
psql -U nc_user -d nc_telearning -f database/schema.sql
psql -U nc_user -d nc_telearning -f database/seed.sql
```

### 3. Environment Configuration

#### Backend (.env)
```bash
# Copy example file
cp backend/env.example backend/.env

# Edit backend/.env with your settings
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nc_telearning
DATABASE_USER=nc_user
DATABASE_PASSWORD=nc_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```bash
# Create frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Frontend: npm run dev:frontend
# Backend: npm run dev:backend
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **pgAdmin4**: http://localhost:5050 (admin@nc-telearning.com / admin123)

## 📚 Default Accounts

### Admin/Teacher Account
- **Email**: admin@nc-telearning.com
- **Password**: password123
- **Role**: Admin

### Student Accounts
- **Email**: student1@nc-telearning.com
- **Password**: password123
- **Grade**: 10

- **Email**: student2@nc-telearning.com
- **Password**: password123
- **Grade**: 11

- **Email**: student3@nc-telearning.com
- **Password**: password123
- **Grade**: 12

## 🎨 Theme Colors

The application uses a custom Vietnamese-inspired color palette:

- **Primary Cream**: `#FEF3E2` - Background and light elements
- **Golden Yellow**: `#F3C623` - Primary buttons and highlights
- **Orange**: `#FFB22C` - Secondary buttons and accents
- **Dark Orange**: `#FA812F` - Text and important elements

## 🏗️ Project Structure

```
nc-telearning/
├── frontend/                 # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── courses/     # Course listing
│   │   │   ├── videos/      # Video gallery
│   │   │   └── practice/     # Practice exercises
│   │   └── components/      # Reusable components
│   └── tailwind.config.ts   # Tailwind configuration
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management
│   │   ├── courses/         # Course management
│   │   ├── lessons/         # Lesson management
│   │   ├── videos/          # Video management
│   │   ├── quizzes/         # Quiz system
│   │   ├── essay-exercises/ # Essay exercises
│   │   └── user-progress/   # Progress tracking
│   └── env.example          # Environment template
├── database/                # Database files
│   ├── schema.sql          # Database schema
│   ├── seed.sql            # Sample data
│   └── README.md           # Database documentation
└── docker-compose.yml      # Docker setup
```

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build

# Start individual services
npm run dev:frontend    # Frontend only
npm run dev:backend     # Backend only
```

## 📱 Features Implemented

### ✅ Core Features
- **Authentication System**: JWT-based auth with role management
- **User Roles**: Admin (teachers) and User (students)
- **Course Management**: Grade-specific courses (10, 11, 12)
- **Video Lessons**: YouTube-like video interface
- **Practice System**: Multiple-choice quizzes and essay exercises
- **Progress Tracking**: User progress and completion tracking
- **Responsive Design**: Mobile and desktop optimized
- **Vietnamese Content**: Full Vietnamese localization

### 🎯 Key Pages
- **Homepage**: Landing page with features and statistics
- **Courses**: Course listing with grade filtering
- **Videos**: Video gallery with search and filtering
- **Practice**: Quiz and essay exercise interface
- **Authentication**: Login and registration pages

### 🛠️ Technical Features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Custom theme with Vietnamese colors
- **Responsive Design**: Mobile-first approach
- **API Integration**: RESTful API with NestJS
- **Database**: PostgreSQL with proper relationships
- **Authentication**: Secure JWT implementation

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment
2. Update database connection strings
3. Set secure JWT secret
4. Configure CORS for production domain
5. Build and deploy: `npm run build:backend`

### Frontend Deployment
1. Update API URL in environment variables
2. Build static files: `npm run build:frontend`
3. Deploy to Vercel, Netlify, or similar platform

### Database Production
1. Use managed PostgreSQL service
2. Set up proper backups
3. Configure connection pooling
4. Set up monitoring

## 🔒 Security Considerations

- Change default JWT secret in production
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Set up proper CORS policies
- Use environment variables for secrets

## 📞 Support

For questions or issues:
- Check the database README for setup issues
- Review the API documentation in backend modules
- Ensure all environment variables are set correctly
- Verify database connection and permissions

## 🎉 Next Steps

The application is ready for development and testing. Consider adding:
- Video upload functionality
- Real-time notifications
- Advanced analytics
- Mobile app development
- Payment integration
- Advanced quiz features
