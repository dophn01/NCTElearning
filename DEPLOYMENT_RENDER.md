# Deployment Guide - Render (Full Stack)

This guide will help you deploy NC Telearning to Render with all services:
- **Frontend**: Next.js on Render
- **Backend**: NestJS API on Render
- **Database**: PostgreSQL on Render

## Prerequisites

1. GitHub account with your repository pushed
2. Render account (free tier available at [render.com](https://render.com))

---

## Option 1: Deploy Using Render Blueprint (Recommended)

### Step 1: Connect Repository to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the repository: `dophn01/NCTElearning`
5. Render will detect `render.yaml` automatically
6. Review the services that will be created:
   - PostgreSQL Database
   - Backend API Service
   - Frontend Service
7. Click **"Apply"**

### Step 2: Configure Services

Render will create all three services. You may need to:

1. **Link Database to Backend**:
   - Go to your backend service
   - Navigate to **Environment** tab
   - Click **"Link Database"** and select `nctelearning-db`
   - This auto-populates database connection variables

2. **Update Environment Variables**:
   - **Backend**: Verify `CORS_ORIGIN` includes your frontend URL
   - **Frontend**: Verify `NEXT_PUBLIC_API_BASE_URL` points to your backend URL

3. **Wait for Deployments** (10-15 minutes for all services)

### Step 3: Run Database Migrations

1. Get **External Database URL** from Render PostgreSQL service
2. Connect using pgAdmin, DBeaver, or psql
3. Run the SQL scripts:
   ```sql
   -- Run database/schema.sql first
   -- Then run database/seed.sql if you have seed data
   ```

### Step 4: Update CORS Configuration

After all services are deployed:

1. Go to **Backend Service** → **Environment**
2. Update `CORS_ORIGIN` to include your frontend URL:
   ```
   https://nctelearning-frontend.onrender.com,http://localhost:3000
   ```
3. Click **"Save Changes"** (triggers redeploy)

---

## Option 2: Manual Deployment (Step by Step)

### Step 1: Deploy PostgreSQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `nctelearning-db`
   - **Database**: `nctelearning`
   - **User**: `nct_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or upgrade for production)
3. Click **"Create Database"**
4. **Save the connection details** (Internal Database URL)

### Step 2: Run Database Migrations

1. Get **External Database URL** from Render dashboard
2. Connect using a PostgreSQL client
3. Run `database/schema.sql`
4. (Optional) Run `database/seed.sql` for test data

### Step 3: Deploy Backend API

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `nctelearning-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
4. **Environment Variables** - Add these:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_TYPE=postgres
   DATABASE_SSL=true
   JWT_SECRET=<generate using: node scripts/generate-jwt-secret.js>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://nctelearning-frontend.onrender.com
   MAX_FILE_SIZE=104857600
   UPLOAD_DEST=./uploads
   ```
5. **Link Database**: Click "Link Database" → Select `nctelearning-db`
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. **Copy backend URL**: `https://nctelearning-backend.onrender.com`

### Step 4: Deploy Frontend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `nctelearning-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. **Environment Variables** - Add:
   ```
   NODE_ENV=production
   PORT=10000
   NEXT_PUBLIC_API_BASE_URL=https://nctelearning-backend.onrender.com
   ```
5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **Copy frontend URL**: `https://nctelearning-frontend.onrender.com`

### Step 5: Update CORS

1. Go to **Backend Service** → **Environment**
2. Update `CORS_ORIGIN`:
   ```
   https://nctelearning-frontend.onrender.com,http://localhost:3000
   ```
3. Click **"Save Changes"**

---

## Verify Deployment

### Test Backend
- Visit: `https://nctelearning-backend.onrender.com`
- Should see: "NC Telearning API is running. Visit /api for endpoints."
- Test: `https://nctelearning-backend.onrender.com/api/auth/profile`

### Test Frontend
- Visit: `https://nctelearning-frontend.onrender.com`
- Should load the homepage
- Try logging in/registering
- Check browser console for errors

---

## Environment Variables Reference

### Backend (Render)
```
NODE_ENV=production
PORT=10000
DATABASE_TYPE=postgres
DATABASE_HOST=<auto-set when linking DB>
DATABASE_PORT=5432
DATABASE_NAME=nctelearning
DATABASE_USER=nct_user
DATABASE_PASSWORD=<auto-set when linking DB>
DATABASE_SSL=true
JWT_SECRET=<strong random string>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://nctelearning-frontend.onrender.com,http://localhost:3000
MAX_FILE_SIZE=104857600
UPLOAD_DEST=./uploads
```

### Frontend (Render)
```
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_API_BASE_URL=https://nctelearning-backend.onrender.com
```

---

## Troubleshooting

### Backend Issues

**Database Connection Errors**
- Verify database is linked to backend service
- Check DATABASE_SSL=true is set
- Ensure database service is running

**CORS Errors**
- Verify CORS_ORIGIN includes your frontend URL
- Check for trailing slashes
- Ensure credentials: true is configured

**Build Failures**
- Check Render build logs
- Verify all dependencies in package.json
- Check Node.js version compatibility

### Frontend Issues

**Build Failures**
- Check Render build logs
- Verify TypeScript compilation
- Ensure all dependencies installed

**API Connection Errors**
- Verify NEXT_PUBLIC_API_BASE_URL is correct
- Check backend is accessible
- Verify CORS configuration

**Port Errors**
- Ensure PORT=10000 is set
- Render uses port 10000 by default

---

## Render-Specific Notes

### Free Tier Limitations

- **Services spin down** after 15 minutes of inactivity
- **First request** after spin-down takes 30-60 seconds (cold start)
- **Database**: 90 days free trial, then paid
- Consider upgrading for production use

### Auto-Deploy

- Render auto-deploys on push to main branch
- You can disable this in service settings
- Manual deployments available in dashboard

### Custom Domains

1. Go to service → **Settings** → **Custom Domains**
2. Add your domain
3. Update DNS records as instructed
4. Update CORS_ORIGIN to include custom domain

### Health Checks

- Render automatically health checks your services
- Backend: `GET /` should return 200
- Frontend: Should serve Next.js app
- Check **Logs** tab for errors

---

## Production Checklist

- [ ] Database migrations completed
- [ ] All services deployed and accessible
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials secure
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Monitor error logs
- [ ] Set up custom domains (optional)
- [ ] Configure auto-deploy settings
- [ ] Set up monitoring/alerts

---

## Updating Deployments

### Automatic Updates
- Push changes to GitHub main branch
- Render will auto-deploy all services
- Check deployment status in dashboard

### Manual Updates
- Go to service → **Manual Deploy**
- Select branch/commit
- Click **Deploy**

---

## Cost Considerations

### Free Tier
- Web services: 750 hours/month
- PostgreSQL: 90 days free trial
- Services spin down after inactivity

### Paid Plans
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: Custom pricing
- Database: Starts at $20/month

---

## Security Best Practices

1. **Never commit** `.env` files
2. **Use strong JWT_SECRET** (32+ random characters)
3. **Enable HTTPS** (automatic on Render)
4. **Regularly update** dependencies
5. **Monitor** error logs
6. **Use environment variables** for all secrets
7. **Rotate secrets** periodically

---

## Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration
5. Review this guide

Good luck with your deployment! 🚀

