# Environment Variables Reference

Quick reference for all environment variables needed for deployment.

## Frontend (Render)

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` (Render default) |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `https://nctelearning-backend.onrender.com` |

### How to Set in Render

1. Go to your frontend service in Render dashboard
2. Navigate to **Environment** tab
3. Add each variable with its value
4. Click **Save Changes** (triggers redeploy)

---

## Backend (Render)

### Required Variables

| Variable | Description | Example/Notes |
|----------|-------------|---------------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` (Render default) |
| `DATABASE_TYPE` | Database type | `postgres` |
| `DATABASE_HOST` | Database host | Auto-set when linking DB |
| `DATABASE_PORT` | Database port | `5432` |
| `DATABASE_NAME` | Database name | `nctelearning` |
| `DATABASE_USER` | Database user | `nct_user` |
| `DATABASE_PASSWORD` | Database password | Auto-set when linking DB |
| `DATABASE_SSL` | Enable SSL | `true` |
| `JWT_SECRET` | JWT signing secret | Generate strong random string |
| `JWT_EXPIRES_IN` | JWT expiration | `24h` |
| `CORS_ORIGIN` | Allowed origins | `https://nctelearning-frontend.onrender.com,http://localhost:3000` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `104857600` (100MB) |
| `UPLOAD_DEST` | Upload directory | `./uploads` |

### How to Set in Render

1. Go to your web service in Render dashboard
2. Navigate to **Environment** tab
3. Add each variable with its value
4. Click **Save Changes** (triggers redeploy)

### Auto-Generated Variables (when linking database)

When you link a PostgreSQL service to your web service, Render automatically provides:
- `DATABASE_HOST`
- `DATABASE_PASSWORD`
- `DATABASE_URL` (full connection string)

You can reference these in your environment variables.

---

## Local Development

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Frontend (Render)

```env
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_API_BASE_URL=https://nctelearning-backend.onrender.com
```

### Backend (.env)

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nc_telearning
DATABASE_USER=nc_user
DATABASE_PASSWORD=nc_password
DATABASE_TYPE=postgres
DATABASE_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=104857600
UPLOAD_DEST=./uploads
```

---

## Security Best Practices

1. **Never commit** `.env` files to Git
2. **Use strong secrets**: Generate JWT_SECRET with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Separate environments**: Use different values for dev/staging/production
4. **Rotate secrets**: Change JWT_SECRET periodically
5. **Limit CORS**: Only include necessary origins

---

## Quick Setup Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Environment Variables
```bash
# Frontend
echo $NEXT_PUBLIC_API_BASE_URL

# Backend
echo $DATABASE_HOST
echo $JWT_SECRET
```

---

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify backend URL is accessible
- Check CORS configuration in backend

### Backend database connection fails
- Verify all DATABASE_* variables are set
- Check DATABASE_SSL=true for production
- Ensure database service is running

### CORS errors
- Verify CORS_ORIGIN includes frontend URL
- Check for trailing slashes in URLs
- Ensure credentials: true is configured

