# 🚀 SAATHI-AI Deployment to Vercel - Quick Start

## Option 1: Deploy via GitHub + Vercel (Recommended)

### Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `saathi-ai`
3. **Do NOT** initialize with README (we already have one)

### Step 2: Push Code to GitHub
```bash
cd c:\Users\HP\Downloads\repo-ai-main
git remote add origin https://github.com/YOUR_USERNAME/saathi-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Visit https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste your GitHub repo URL and click **"Continue"**
5. Vercel will auto-detect Next.js

### Step 4: Configure Deployment
In the "Configure Project" step:
- **Project Name**: `saathi-ai` (or any name you prefer)
- **Framework Preset**: Next.js ✅ (auto-detected)
- **Root Directory**: Set to `frontend/` ⭐ **IMPORTANT**
- **Build Command**: `npm run build` ✅ (auto-filled)
- **Output Directory**: `.next` ✅ (auto-filled)
- **Environment Variables**: Add these:
  - `NEXT_PUBLIC_API_URL` = `/api`

### Step 5: Deploy
Click **"Deploy"** and wait 2-3 minutes.

**You'll get a URL like:** `https://saathi-ai.vercel.app`

---

## Option 2: Deploy from Local Machine (One-Click)

If you want to deploy without GitHub:

```bash
cd c:\Users\HP\Downloads\repo-ai-main\frontend
vercel --prod --name saathi-ai
```

Then follow the CLI prompts:
- Set project name when asked
- Confirm root directory is the frontend folder
- Accept default build settings

---

## 🎯 What Gets Deployed

✅ **Next.js Frontend** - Full interactive UI
✅ **Mock API Routes** - `/api/health` and `/api/sessions/start`
✅ **All Components** - Live Session, AI Reasoning, Case Queue, Historical Analysis
✅ **Production Build** - Optimized and compressed

---

## 📊 Expected Result After Deployment

Your live website will have:
- ✅ Interactive SAATHI-AI dashboard
- ✅ Live session start capability (with mock data)
- ✅ Real-time SVI scoring display
- ✅ Observable indicators detection
- ✅ Operator co-pilot guidance
- ✅ Case history browsing

---

## 🔄 Updating Deployment

After deployment, any changes you push to GitHub will automatically redeploy:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel will automatically rebuild and deploy within 1-2 minutes!

---

## 🌐 Connect to Real Backend (Later)

Once your Python backend is ready:

1. Deploy backend to a server (AWS, Heroku, Railway, etc.)
2. In Vercel Dashboard → Project Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to your backend URL:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   ```
4. Vercel will automatically redeploy with the new configuration

---

## ❓ Troubleshooting

**"Root directory not found"**
- Make sure you set Root Directory to `frontend/` (with trailing slash)

**"Build failed"**
- Check the Vercel logs in the dashboard
- Ensure `frontend/package.json` exists
- Run `npm install` locally to verify dependencies

**"API returns 404"**
- Verify `NEXT_PUBLIC_API_URL=/api` is set in environment variables
- Check that `/api/health` and `/api/sessions/start` routes exist in `frontend/src/app/api/`

**"Microphone access denied"**
- This is a browser permission - user needs to allow microphone access
- Some browsers require HTTPS (Vercel provides this automatically)

---

## ✨ You're All Set!

Your app is ready to deploy. Choose either GitHub method (recommended) or direct CLI deployment above.

**Any questions? Check the build logs in Vercel dashboard!**
