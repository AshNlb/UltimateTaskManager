# TaskFlow Deployment Guide

This guide will help you deploy TaskFlow as a web application using Railway (backend) and Vercel (frontend).

## Total Cost: $5-15/month

- **Railway**: $5/month (backend + PostgreSQL database)
- **Vercel**: Free (frontend hosting)
- **OpenAI API**: $0-10/month (protected by hard limit + rate limiting)

## Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)

---

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with your GitHub account
3. Add $5 credit to your account

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account if not already connected
4. Select the `UltimateTaskManager` repository
5. Railway will auto-detect the backend

### 1.3 Configure Backend Service
1. Click on the deployed service
2. Go to "Settings"
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install && npm run build`
5. Set **Start Command**: `npm start`

### 1.4 Add PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically added to your backend service

### 1.5 Set Environment Variables
In your backend service settings, add these environment variables:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=5000
```

**Required for AI chatbot** (recommended):
```
OPENAI_API_KEY=your-openai-api-key
```

To get your OpenAI API key:
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and add it to Railway environment variables
5. **IMPORTANT**: Set usage limits at https://platform.openai.com/account/billing/limits
   - Hard limit: $10/month (recommended)
   - Soft limit: $5/month (get email alert)

**Cost Protection:**
- Backend has built-in rate limiting: 10 questions per user per day
- OpenAI hard limit: Stops API automatically when limit is reached
- Estimated cost: ~$1 per 1,000 questions

### 1.6 Run Database Migration
1. In Railway backend service, go to "Settings" → "Deploy"
2. Add a custom deploy command: `npm run db:push`
3. Or connect via Railway CLI and run: `railway run npm run db:push`

### 1.7 Get Backend URL
1. Go to your backend service in Railway
2. Click on "Settings" → "Domains"
3. Click "Generate Domain"
4. Copy the generated URL (e.g., `https://your-app.railway.app`)

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Import your `UltimateTaskManager` repository
3. Vercel will auto-detect it as a Vite project

### 2.3 Configure Frontend Build
1. Set **Root Directory**: `frontend`
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)

### 2.4 Add Environment Variable
Add this environment variable in Vercel:

```
VITE_API_URL=https://your-backend-url.railway.app/api
```

Replace `your-backend-url.railway.app` with your actual Railway backend URL from Step 1.7.

### 2.5 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

---

## Step 3: Update Landing Page

Update the landing page URL in `index.html`:

```html
<a href="https://your-app.vercel.app" class="download-btn ...">
```

Replace with your actual Vercel URL from Step 2.5.

Commit and push:
```bash
git add index.html
git commit -m "Update landing page with app URL"
git push
```

---

## Step 4: Configure Backend CORS

Make sure your backend allows requests from your Vercel domain. Check `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

---

## Testing Your Deployment

1. Visit your Vercel URL
2. Create a new account
3. Test all features:
   - Create buckets
   - Add tasks
   - Update task status
   - Try the Q&A assistant (if you added API keys)

---

## Monitoring & Maintenance

### Railway Dashboard
- Monitor backend performance
- View logs
- Check database usage
- View billing

### Vercel Dashboard
- Monitor frontend deployments
- View analytics
- Check build logs

---

## Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify environment variables are set
- Ensure database migration ran successfully

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS configuration in backend
- Verify Railway backend is running

### Database connection errors
- Check `DATABASE_URL` is automatically set by Railway
- Run migration: `railway run npm run db:push`

---

## Canceling Subscription

To stop paying for Railway:
1. Go to Railway dashboard
2. Select your project
3. Click "Settings" → "Delete Project"
4. Your billing will stop immediately

Vercel is free, no cancellation needed.

---

## Cost Optimization

- Railway charges based on usage (~$5/month for light usage)
- If no one uses the app, costs will be minimal
- You can pause/delete the project anytime
- Vercel is completely free for this use case

---

## Support

For issues:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- GitHub: https://github.com/AshNlb/UltimateTaskManager/issues
