# Deployment Guide

This guide will help you deploy NC Telearning to production:
- **Frontend**: Vercel
- **Backend & Database**: Render

## Prerequisites

1. GitHub account with your repository pushed
2. Vercel account (free tier available)
3. Render account (free tier available)

---

## Part 1: Deploy Backend & Database to Render

### Step 1: Create Render Account and Connect GitHub

1. Go to [render.com](https://render.com) and sign up/login
2. Connect your GitHub account
3. Link your repository

### Step 2: Deploy PostgreSQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `nctelearning-db`
   - **Database**: `nctelearning`
   - **User**: `nct_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or upgrade for production)
3. Click **"Create Database"**
4. **Important**: Copy the **Internal Database URL** (you'll need this later)
   - Format: `postgresql://nct_user:password@dpg-xxxxx-a/nctelearning`

### Step 3: Run Database Migrations

1. Connect to your Render database using a PostgreSQL client (pgAdmin, DBeaver, or psql)
2. Use the **External Database URL** from Render dashboard
3. Run the SQL scripts from `database/` folder:
   ```sql
   -- Run database/schema.sql first
   -- Then run database/seed.sql if you have seed data
   ```

### Step 4: Deploy Backend API

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `nctelearning-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm run start:prod`
   - **Root Directory**: Leave empty (or set to `backend` if needed)
4. **Environment Variables** - Add these:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_TYPE=postgres
   DATABASE_HOST=<from your PostgreSQL service>
   DATABASE_PORT=5432
   DATABASE_NAME=nctelearning
   DATABASE_USER=nct_user
   DATABASE_PASSWORD=<from your PostgreSQL service>
   DATABASE_SSL=true
   JWT_SECRET=<generate a strong random string>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://your-frontend.vercel.app
   MAX_FILE_SIZE=104857600
   UPLOAD_DEST=./uploads
   ```
5. **Link Database**: Click "Link Database" and select your PostgreSQL service
   - This will auto-populate DATABASE_HOST, DATABASE_PASSWORD, etc.
6. Click **"Create Web Service"**
7. Wait for deployment to complete
8. **Copy your backend URL**: `https://nctelearning-backend.onrender.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Connect your GitHub account

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
```

**Important**: Replace `your-backend-url.onrender.com` with your actual Render backend URL from Step 4 above.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Copy your frontend URL**: `https://your-project.vercel.app`

---

## Part 3: Update CORS Configuration

After getting your Vercel frontend URL, update the backend CORS:

1. Go to Render dashboard → Your backend service → **Environment**
2. Update `CORS_ORIGIN` to include your Vercel URL:
   ```
   CORS_ORIGIN=https://your-project.vercel.app,http://localhost:3000
   ```
   (Include localhost for local development)
3. Click **"Save Changes"** - this will trigger a redeploy

---

## Part 4: Verify Deployment

### Test Backend
- Visit: `https://your-backend.onrender.com`
- Should see: "NC Telearning API is running. Visit /api for endpoints."
- Test endpoint: `https://your-backend.onrender.com/api/auth/profile` (should require auth)

### Test Frontend
- Visit: `https://your-project.vercel.app`
- Should load the homepage
- Try logging in/registering

---

## Troubleshooting

### Backend Issues

**Database Connection Errors**
- Verify DATABASE_HOST, DATABASE_PASSWORD are correct
- Check if DATABASE_SSL=true is set
- Ensure database is running in Render

**CORS Errors**
- Verify CORS_ORIGIN includes your Vercel URL
- Check browser console for specific CORS errors
- Ensure credentials: true is set (already configured)

**Build Failures**
- Check Render build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Frontend Issues

**API Connection Errors**
- Verify NEXT_PUBLIC_API_BASE_URL is set correctly
- Check that backend URL is accessible
- Ensure backend CORS allows your Vercel domain

**Build Failures**
- Check Vercel build logs
- Ensure all dependencies are installed
- Verify TypeScript compilation errors

---

## Environment Variables Reference

### Backend (Render)
```
NODE_ENV=production
PORT=10000
DATABASE_TYPE=postgres
DATABASE_HOST=<from Render PostgreSQL>
DATABASE_PORT=5432
DATABASE_NAME=nctelearning
DATABASE_USER=nct_user
DATABASE_PASSWORD=<from Render PostgreSQL>
DATABASE_SSL=true
JWT_SECRET=<strong random string>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
MAX_FILE_SIZE=104857600
UPLOAD_DEST=./uploads
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
```

---

## Production Checklist

- [ ] Database migrations run successfully
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Monitor error logs

---

## Updating Deployments

### Backend Updates
- Push changes to GitHub
- Render will auto-deploy (if auto-deploy is enabled)
- Or manually trigger deployment from Render dashboard

### Frontend Updates
- Push changes to GitHub
- Vercel will auto-deploy
- Or manually trigger deployment from Vercel dashboard

---

## Cost Considerations

### Free Tier Limits

**Render:**
- Web services: 750 hours/month (free tier)
- PostgreSQL: 90 days free trial, then paid
- Consider upgrading for production use

**Vercel:**
- Generous free tier for Next.js
- Bandwidth limits apply
- Check current pricing

---

## Security Notes

1. **Never commit** `.env` files to Git
2. **Use strong JWT_SECRET** (32+ random characters)
3. **Enable HTTPS** (automatic on Vercel/Render)
4. **Regularly update** dependencies
5. **Monitor** error logs for security issues
6. **Use environment variables** for all secrets

---

## Support

If you encounter issues:
1. Check Render/Vercel logs
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration
5. Review this guide again

Good luck with your deployment! 🚀

