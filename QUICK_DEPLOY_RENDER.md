# Quick Deployment Checklist - Render (All Services)

Deploy frontend, backend, and database to Render in ~30 minutes.

## ✅ Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] Database schema ready (`database/schema.sql`)
- [ ] Generate JWT secret: `node scripts/generate-jwt-secret.js`

---

## 🚀 Option A: Blueprint Deployment (Fastest - 15 minutes)

### Step 1: Deploy Everything at Once
1. Go to [render.com](https://render.com) → **New +** → **Blueprint**
2. Connect GitHub repo: `dophn01/NCTElearning`
3. Render detects `render.yaml` automatically
4. Review services (Database, Backend, Frontend)
5. Click **Apply**
6. Wait for all services to deploy (10-15 minutes)

### Step 2: Link Database
1. Go to **Backend Service** → **Environment**
2. Click **Link Database** → Select `nctelearning-db`
3. Database variables auto-populate

### Step 3: Run Migrations
1. Get **External Database URL** from PostgreSQL service
2. Connect with pgAdmin/DBeaver/psql
3. Run `database/schema.sql`

### Step 4: Update URLs
1. **Backend** → **Environment** → Update `CORS_ORIGIN`:
   ```
   https://nctelearning-frontend.onrender.com,http://localhost:3000
   ```
2. **Frontend** → **Environment** → Verify `NEXT_PUBLIC_API_BASE_URL`:
   ```
   https://nctelearning-backend.onrender.com
   ```
3. Save changes (triggers redeploy)

**Done!** 🎉

---

## 🛠️ Option B: Manual Deployment (Step by Step - 30 minutes)

### Step 1: Database (5 min)
1. **New +** → **PostgreSQL**
2. Name: `nctelearning-db`
3. Database: `nctelearning`
4. User: `nct_user`
5. **Create Database**

### Step 2: Run Migrations (5 min)
1. Get **External Database URL**
2. Connect and run `database/schema.sql`

### Step 3: Backend (10 min)
1. **New +** → **Web Service**
2. Connect GitHub repo
3. Configure:
   - Name: `nctelearning-backend`
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
4. Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_TYPE=postgres
   DATABASE_SSL=true
   JWT_SECRET=<from script>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://nctelearning-frontend.onrender.com
   MAX_FILE_SIZE=104857600
   UPLOAD_DEST=./uploads
   ```
5. **Link Database** → Select `nctelearning-db`
6. **Create Web Service**
7. Copy backend URL

### Step 4: Frontend (10 min)
1. **New +** → **Web Service**
2. Connect GitHub repo
3. Configure:
   - Name: `nctelearning-frontend`
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Start: `npm run start`
4. Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   NEXT_PUBLIC_API_BASE_URL=https://nctelearning-backend.onrender.com
   ```
5. **Create Web Service**
6. Copy frontend URL

### Step 5: Update CORS (2 min)
1. **Backend** → **Environment**
2. Update `CORS_ORIGIN` with frontend URL
3. Save

**Done!** 🎉

---

## ✅ Verification

- [ ] Backend: `https://nctelearning-backend.onrender.com` works
- [ ] Frontend: `https://nctelearning-frontend.onrender.com` loads
- [ ] Database migrations completed
- [ ] Can register/login
- [ ] API calls work
- [ ] No CORS errors

---

## 🔧 Quick Fixes

### Services won't start
- Check build logs in Render
- Verify environment variables
- Ensure database is linked (backend)

### CORS errors
- Update `CORS_ORIGIN` in backend
- Include both production and localhost URLs
- No trailing slashes

### Database connection fails
- Verify database is linked
- Check `DATABASE_SSL=true`
- Ensure database is running

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Test backend URL directly
- Check CORS configuration

---

## 📝 Important Notes

1. **Free tier services spin down** after 15 min inactivity
2. **First request** after spin-down takes 30-60 seconds
3. **Database**: 90 days free, then paid
4. **Auto-deploy**: Enabled by default on push to main

---

## 🎯 Next Steps

1. Test all features
2. Set up custom domains (optional)
3. Configure monitoring
4. Plan for production upgrade

**Estimated Time**: 15-30 minutes

Good luck! 🚀

