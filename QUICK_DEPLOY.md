# 🚀 Deploy to Vercel - Step by Step

## Quick Manual Deployment (Easiest Method)

### Step 1: Go to Vercel
Visit: https://vercel.com

### Step 2: Click "Add New" → "Project"

### Step 3: Deploy via Git Import
1. Click **"Import Git Repository"**
2. Paste this repository URL (or your GitHub fork):
   ```
   https://github.com/YOUR_USERNAME/saathi-ai
   ```
3. Click **"Continue"**

### Step 4: Configure the Project
Vercel will auto-detect Next.js. Make these settings:

**Root Directory**: `frontend/` ⭐ **IMPORTANT** - Click "Edit" and set this!

**Framework**: Next.js ✅ (auto-selected)

**Build Command**: `npm run build` ✅ (auto-filled)

**Install Command**: `npm install` ✅ (auto-filled)

**Output Directory**: `.next` ✅ (auto-filled)

### Step 5: Add Environment Variables
Click "Environment Variables" and add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `/api` |

### Step 6: Deploy!
Click the **"Deploy"** button and wait 2-3 minutes.

---

## 🎉 You'll Get a Live URL!

After deployment completes, you'll see:
```
Congratulations! Your project has been deployed.
URL: https://saathi-ai-XXXX.vercel.app
```

---

## 🔗 If You Don't Have a GitHub Repo Yet

### Option A: Create a New GitHub Repo (5 minutes)
1. Go to https://github.com/new
2. Name it `saathi-ai`
3. Click "Create repository"
4. In your terminal:
   ```bash
   cd c:\Users\HP\Downloads\repo-ai-main
   git remote add origin https://github.com/YOUR_USERNAME/saathi-ai.git
   git branch -M main
   git push -u origin main
   ```
5. Then follow the deployment steps above

### Option B: Use Vercel's Direct Upload (Skip GitHub)
If you don't want to use GitHub:
1. In Vercel dashboard, click **"New Project"** → **"Quickstart"**
2. Choose **"Other"** template
3. Click **"Upload"** and select the `frontend/` folder
4. Configure as described above
5. Deploy

---

## ✅ Verification After Deployment

Once deployed, your live site should show:
- ✅ SAATHI-AI title
- ✅ "Engine 1 Live" badge
- ✅ "Start Live Session" button
- ✅ Interactive dashboard with mock data
- ✅ "Backend: Online (Engine 1 Live)" status

Try clicking "Start Live Session" - it should activate the microphone and show real-time SVI scoring!

---

## 🎯 You're Ready!

**Go to Vercel now and deploy your app!** It's live and working. Takes just 2-3 minutes.

Share your Vercel URL with anyone to show off the SAATHI-AI platform! 🎉
