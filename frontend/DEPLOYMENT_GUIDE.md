# SAATHI-AI Deployment Guide

Your frontend is ready for deployment! Here are two options:

## Option 1: Deploy via GitHub + Vercel (Recommended ⭐)

### Step 1: Push Code to GitHub
```bash
cd c:\Users\HP\Downloads\repo-ai-main
git add .
git commit -m "Ready for deployment - mock API configured"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Search for and select your repository
5. In the configuration, make sure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL` = `/api`
6. Click **"Deploy"** and wait ~2-3 minutes

### Step 3: Get Your Live URL
After deployment completes, you'll get a URL like:
```
https://your-project-name.vercel.app
```

---

## Option 2: Deploy Locally with Node.js (Development Server)

If you want to test locally first:

```bash
cd c:\Users\HP\Downloads\repo-ai-main\frontend
npm install
npm run build
npm run start
```

Then visit: `http://localhost:3000`

---

## 📋 What's Included in This Deployment

✅ **Live SAATHI-AI UI** with all components:
  - Start Live Session tab
  - AI Reasoning Breakdown
  - Case Queue view
  - Historical Pattern Analysis

✅ **Mock API Endpoints** (no backend needed):
  - `/api/health` - Returns backend status
  - `/api/sessions/start` - Initializes a session

✅ **Synthetic Case Data** - Comes with sample cases for demo

✅ **Fully Functional UI** - Interactive dashboards, case selection, and more

---

## 🔄 Next Steps (When Backend is Ready)

Once your Python backend is built:

1. **Update Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url
   ```

2. **Update in Vercel**:
   - Go to Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to your backend URL

3. **The UI will automatically connect** to your real backend!

---

## ❓ Troubleshooting

**Issue**: "Cannot find module" errors
- Solution: Delete `node_modules` and `.next`, run `npm install && npm run build`

**Issue**: API not responding
- Solution: Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel

**Issue**: Build fails on Vercel
- Solution: Check build logs in Vercel dashboard → Project → Deployments

---

## 📞 Support
If you need help connecting the backend later, update the `NEXT_PUBLIC_API_URL` environment variable and the frontend will automatically route all requests to your backend.

**Your frontend is deployment-ready! 🚀**
