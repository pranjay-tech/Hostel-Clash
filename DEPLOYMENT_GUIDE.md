# 🚀 24/7 Free Cloud Deployment Guide

Deploy **Hostel Clash (Room 154 vs Room 264)** for free 24/7 access from mobile and desktop.

---

## 📋 Architecture Overview
- **Frontend**: **Vercel** (Free Hobby Tier)
  - Global edge CDN, ultra-fast load time, free SSL (`https://...vercel.app`), zero cold starts.
- **Backend API**: **Render** (Free Web Service Tier)
  - Node.js Express server running `/api` routes with uncapped scoring calculations.

---

## 🛠️ Step 1: Push Code to GitHub

Open a terminal in the project folder (`room-competition`) and run:

```bash
# 1. Initialize git
git init

# 2. Add all files (node_modules and local .env are already ignored by .gitignore)
git add .

# 3. Commit
git commit -m "feat: complete hostel clash scoreboard with uncapped scoring"

# 4. Rename branch to main
git branch -M main

# 5. Create a new repository on GitHub (e.g. 'room-competition') and link it:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## ⚙️ Step 2: Deploy Backend to Render (Free)

1. Go to [dashboard.render.com](https://dashboard.render.com/) and sign in with GitHub.
2. Click **"New +"** (top right) $\rightarrow$ select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and select your `room-competition` repo.
4. Fill in the following settings:
   - **Name**: `room-competition-api` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., *Singapore* or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install --prefix server`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: **Free**
5. Under **Environment Variables**, add:
   - `ADMIN_PASSKEY` = `pranjay_admin_45`
   - `NODE_ENV` = `production`
6. Click **"Create Web Service"**.
7. Wait ~2 minutes for the deployment to finish. Once live, copy your Render URL:
   > Example: `https://room-competition-api.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Import your `room-competition` repository.
4. Configure Project settings:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: `./` *(default)*
   - **Build Command**: `npm --prefix client run build` *(auto-configured via vercel.json)*
   - **Output Directory**: `client/dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://room-competition-api.onrender.com` *(Paste your Render backend URL from Step 2, no trailing slash)*
6. Click **"Deploy"**.
7. In ~30 seconds, your site will be live at:
   > `https://<your-project-name>.vercel.app`

---

## 🔒 Admin & Member Credentials

- **Admin Passkey**: `pranjay_admin_45`
- **Initial Member Access Keys**:
  - Room 154: `pranjay154`, `abhishek154`, `prakrit154`
  - Room 264: `salil264`, `yajas264`, `gopal264`
  *(Pranjay has his password set; other members set their own password on first sign-in)*

---

## 💾 Data Persistence on Free Tier

- **Cold Starts**: Render free services go to sleep after 15 minutes of inactivity. When someone opens the Vercel URL, the frontend will automatically detect this and display a polite **"Waking up competition cloud server..."** indicator with automatic reconnection.
- **1-Click Backup**: When logged in as Admin, click the **Download** icon in the header at any time to save a full JSON snapshot (`room-clash-backup-YYYY-MM-DD.json`) of all achievements and members.
- **1-Click Restore**: If you ever rebuild or redeploy, open the Admin **"Mark Score"** modal and click **"Restore Backup"** at the bottom to restore your exact records in 1 second.
