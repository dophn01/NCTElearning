# NC Telearning - E-learning Platform for Literature

A full-stack e-learning platform for Literature education targeting grades 10, 11, and 12 students.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with pgAdmin4
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS with custom theme colors

## Theme Colors

- Primary: `#FEF3E2` (Light cream)
- Secondary: `#F3C623` (Golden yellow)
- Accent: `#FFB22C` (Orange)
- Highlight: `#FA812F` (Dark orange)

## Features

- **Role-based Access**: Admin (teachers) and User (students)
- **Video Lessons**: YouTube-like interface for lesson viewing
- **Practice Quizzes**: Multiple-choice reading comprehension
- **Essay Exercises**: Computer-based essay writing practice
- **Responsive Design**: Works on desktop and mobile
- **Vietnamese Language**: Full Vietnamese localization

## Project Structure

```
nc-telearning/
├── frontend/          # Next.js application
├── backend/           # NestJS API server
├── database/          # PostgreSQL schemas and migrations
└── docs/             # Documentation
```

## Getting Started

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Set up PostgreSQL database (see database/README.md)

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update database connection strings and JWT secrets

4. Run the development servers:
   ```bash
   npm run dev
   ```

## Development

- Frontend runs on: http://localhost:3000
- Backend API runs on: http://localhost:3001
- pgAdmin4 runs on: http://localhost:5050

## Deployment

This project is configured for deployment to **Render** (all services):
- **Frontend**: Next.js on Render
- **Backend**: NestJS API on Render
- **Database**: PostgreSQL on Render

### Quick Start

**Option 1: Blueprint Deployment (Recommended)**
1. Go to [render.com](https://render.com) → **New +** → **Blueprint**
2. Connect your GitHub repository
3. Render will detect `render.yaml` and create all services
4. Follow [QUICK_DEPLOY_RENDER.md](./QUICK_DEPLOY_RENDER.md)

**Option 2: Manual Deployment**
- See [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md) for detailed step-by-step instructions

### Documentation
- [QUICK_DEPLOY_RENDER.md](./QUICK_DEPLOY_RENDER.md) - Fast deployment checklist
- [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md) - Complete deployment guide
- [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Environment variables reference

## Contributing

Please follow the established patterns for:
- Component structure in frontend
- API endpoint organization in backend
- Database schema migrations
- Vietnamese content localization
