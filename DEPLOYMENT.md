# 🚀 Deployment Guide - Vercel + Railway

This guide will walk you through deploying your neokatalyst platform using **Vercel** (frontend) and **Railway** (backend).

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account
- ✅ Vercel account (free tier available)
- ✅ Railway account (free tier available)
- ✅ MongoDB Atlas account (free tier available)

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### Create MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in
3. Click **"Create"** → **"Shared"** (free tier)
4. Choose **AWS** and a region close to you
5. Cluster name: `neokatalyst-cluster`
6. Click **"Create Cluster"**

### Configure Database Access
1. **Database Access** → **"Add New Database User"**
   - Username: `neokatalyst-admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: **Read and write to any database**

2. **Network Access** → **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Confirm

### Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://neokatalyst-admin:<password>@neokatalyst-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. **Save this connection string** - you'll need it for Railway!

## 📁 Step 2: Prepare Your GitHub Repository

### Push to GitHub
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial neokatalyst platform"

# Add GitHub remote (replace with your repository)
git remote add origin https://github.com/YOUR_USERNAME/neokatalyst-platform.git

# Push to GitHub
git push -u origin main
```

### Repository Structure
Your repository should look like this:
```
neokatalyst-platform/
├── frontend/          # React app for Vercel
├── backend/           # FastAPI app for Railway
├── README.md
├── DEPLOYMENT.md
├── .gitignore
└── railway.json      # Railway configuration
```

## 🚂 Step 3: Deploy Backend to Railway

### Create Railway Project
1. Go to [Railway](https://railway.app)
2. Sign up with your GitHub account
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `neokatalyst-platform` repository

### Configure Railway Deployment
1. Railway will auto-detect your backend
2. **Select the backend folder** as the root directory
3. Set the **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Set Environment Variables
In your Railway project dashboard:

1. Go to **"Variables"** tab
2. Add these environment variables:
   ```env
   MONGO_URL=mongodb+srv://neokatalyst-admin:YOUR_PASSWORD@neokatalyst-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=neokatalyst_production
   JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
   PORT=8000
   ```

### Deploy Backend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Copy your Railway backend URL** (looks like: `https://your-app-name.up.railway.app`)

## ▲ Step 4: Deploy Frontend to Vercel

### Create Vercel Project
1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account
3. Click **"New Project"**
4. Import your `neokatalyst-platform` repository

### Configure Vercel Deployment
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: `yarn build`
4. **Output Directory**: `build`
5. **Install Command**: `yarn install`

### Set Environment Variables
In Vercel project settings → Environment Variables:

```env
REACT_APP_BACKEND_URL=https://your-railway-backend-url.up.railway.app
```

### Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Your frontend URL** will be: `https://your-project-name.vercel.app`

## 🔗 Step 5: Configure Custom Domain (Optional)

### Add Custom Domain to Vercel
1. In Vercel project → **"Settings"** → **"Domains"**
2. Add your domain: `yourdomain.com`
3. Configure DNS records as shown by Vercel
4. SSL will be automatically configured

### DNS Configuration
Add these records to your domain DNS:
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## ✅ Step 6: Test Your Deployment

### Verify Backend
Visit your Railway backend URL + `/docs`:
```
https://your-railway-backend-url.up.railway.app/docs
```
You should see the FastAPI documentation.

### Test Full Application
1. Visit your Vercel frontend URL
2. Register a new account
3. Try creating workflows in the automation section
4. Upload documents
5. Test all features

## 🔧 Step 7: Update Environment Variables

### Update Backend CORS (Important!)
In your `backend/server.py`, update the CORS middleware:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project-name.vercel.app",
        "https://yourdomain.com",  # if using custom domain
        "https://www.yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push this change to trigger a redeploy.

## 📊 Step 8: Set Up Monitoring (Optional)

### Railway Monitoring
- Railway provides built-in monitoring
- View logs in the Railway dashboard
- Set up alerts for downtime

### Vercel Monitoring
- Vercel provides analytics and performance monitoring
- View deployment logs and metrics
- Set up notifications for failed deployments

## 💰 Cost Estimation

### Free Tier Limits
- **MongoDB Atlas**: 512 MB storage (free forever)
- **Railway**: $5/month after free tier usage
- **Vercel**: 100 GB bandwidth/month (free)

### Expected Monthly Costs
- **MongoDB Atlas**: $0 (free tier)
- **Railway**: $5-15/month (depending on usage)
- **Vercel**: $0-20/month (free for personal projects)

**Total: $5-35/month** for production deployment

## 🔄 Continuous Deployment

### Auto-Deploy Setup
- **Railway**: Automatically deploys on every push to main branch
- **Vercel**: Automatically deploys on every push to main branch

### Development Workflow
```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Both Railway and Vercel will automatically deploy
```

## 🐛 Troubleshooting

### Common Issues

#### Backend Not Connecting to Database
```bash
# Check MongoDB Atlas IP whitelist
# Verify connection string in Railway environment variables
# Check Railway logs for connection errors
```

#### Frontend Can't Connect to Backend
```bash
# Verify REACT_APP_BACKEND_URL in Vercel
# Check Railway backend URL is correct
# Verify CORS settings in backend
```

#### Build Failures
```bash
# Check build logs in Railway/Vercel dashboards
# Verify all dependencies are in requirements.txt/package.json
# Check environment variables are set correctly
```

### Getting Help
- **Railway**: Check the [Railway documentation](https://docs.railway.app)
- **Vercel**: Check the [Vercel documentation](https://vercel.com/docs)
- **MongoDB**: Check the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com)

## 📈 Scaling Your Application

### Performance Optimization
- Enable Vercel's Edge Functions
- Use Railway's auto-scaling features
- Implement caching strategies
- Optimize images and assets

### Database Scaling
- Upgrade MongoDB Atlas cluster when needed
- Implement database indexing
- Use connection pooling
- Monitor database performance

---

## 🎉 Congratulations!

Your neokatalyst platform is now live on the internet! 

**Frontend URL**: `https://your-project-name.vercel.app`
**Backend URL**: `https://your-railway-backend-url.up.railway.app`

Share your platform with users and start transforming businesses digitally! 🚀