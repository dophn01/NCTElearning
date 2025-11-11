# Quick Deployment Checklist

Follow these steps to deploy your application quickly.

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] Database schema is ready (`database/schema.sql`)
- [ ] All environment variables documented

---

## 🚀 Step 1: Deploy Backend to Render (15-20 minutes)

### 1.1 Create PostgreSQL Database
1. Go to [render.com](https://render.com) → **New +** → **PostgreSQL**
2. Name: `nctelearning-db`
3. Database: `nctelearning`
4. User: `nct_user`
5. Click **Create Database**
6. **Save the connection details** (you'll need them)

### 1.2 Run Database Migrations
1. Get **External Database URL** from Render dashboard
2. Connect using pgAdmin, DBeaver, or psql
3. Run `database/schema.sql`
4. (Optional) Run `database/seed.sql` for test data

### 1.3 Deploy Backend API
1. **New +** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `nctelearning-backend`
   - **Root Directory**: `backend` (if deploying from monorepo)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
4. **Environment Variables** (add these):
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_TYPE=postgres
   DATABASE_SSL=true
   JWT_SECRET=<run: node scripts/generate-jwt-secret.js>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://your-frontend.vercel.app
   MAX_FILE_SIZE=104857600
   UPLOAD_DEST=./uploads
   ```
5. **Link Database**: Click "Link Database" → Select your PostgreSQL service
6. Click **Create Web Service**
7. **Wait for deployment** (5-10 minutes)
8. **Copy backend URL**: `https://nctelearning-backend.onrender.com`

---

## 🎨 Step 2: Deploy Frontend to Vercel (10 minutes)

### 2.1 Import Project
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### 2.2 Set Environment Variables
Add this variable:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
```
(Replace with your actual Render backend URL from Step 1.3)

### 2.3 Deploy
1. Click **Deploy**
2. Wait for build (2-5 minutes)
3. **Copy frontend URL**: `https://your-project.vercel.app`

---

## 🔗 Step 3: Connect Frontend & Backend (5 minutes)

### 3.1 Update Backend CORS
1. Go to Render → Your backend service → **Environment**
2. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://your-project.vercel.app,http://localhost:3000
   ```
3. Click **Save Changes** (triggers redeploy)

### 3.2 Verify Connection
1. Visit your Vercel frontend URL
2. Try logging in or registering
3. Check browser console for errors
4. Test API: `https://your-backend.onrender.com/api`

---

## ✅ Post-Deployment Verification

- [ ] Backend accessible: `https://your-backend.onrender.com`
- [ ] Frontend accessible: `https://your-project.vercel.app`
- [ ] Database migrations completed
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Authentication working
- [ ] API endpoints responding

---

## 🐛 Common Issues & Fixes

### Backend won't start
- Check build logs in Render
- Verify all environment variables are set
- Ensure database is linked correctly

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check backend CORS includes frontend URL
- Test backend URL directly in browser

### Database connection errors
- Verify DATABASE_* variables are set
- Check DATABASE_SSL=true
- Ensure database service is running

### CORS errors
- Update CORS_ORIGIN in backend
- Include both production and localhost URLs
- Check for trailing slashes

---

## 📝 Next Steps

1. **Set up custom domains** (optional)
2. **Configure monitoring** (Render/Vercel analytics)
3. **Set up CI/CD** (auto-deploy on push)
4. **Backup database** regularly
5. **Monitor logs** for errors

---

## 🆘 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- Review [ENV_VARIABLES.md](./ENV_VARIABLES.md) for environment setup
- Check Render/Vercel documentation
- Review application logs

---

**Estimated Total Time**: 30-40 minutes

Good luck! 🚀

