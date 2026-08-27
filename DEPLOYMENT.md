# 🚀 FINOVA Deployment Guide

This document provides step-by-step instructions to deploy **FINOVA** (FastAPI Backend + React Vite Frontend + Supabase Database + Gemini AI Intelligence Engine).

---

## 📋 Prerequisites & Credentials Checklist

Before deploying, ensure you have gathered the following credentials:

| Secret / Config Key | Description | Where to Find |
| --- | --- | --- |
| `SUPABASE_URL` | Your Supabase Project API URL | Supabase Dashboard -> Project Settings -> API |
| `SUPABASE_KEY` | Public Anon/Publishable API Key | Supabase Dashboard -> Project Settings -> API |
| `SUPABASE_SERVICE_ROLE_KEY` | Private Service Role Secret | Supabase Dashboard -> Project Settings -> API |
| `GEMINI_API_KEY` | Google Gemini AI API Key | [Google AI Studio](https://aistudio.google.com/) |

---

## 🗄️ Step 1: Database & Storage Setup (Supabase)

1. **Database Schema**:
   - Go to your **Supabase Dashboard** -> **SQL Editor**.
   - Copy the contents of [`backend/supabase_schema.sql`](file:///c:/Users/Vishal/Neuronauts-Zenesys/backend/supabase_schema.sql).
   - Paste into the SQL Editor and click **Run**.
   - This creates all necessary tables (`projects`, `invoices`, `expenses`, `procurement_orders`, `vendors`, `recommendations`, `erp_sync_logs`).

2. **Storage Buckets**:
   - Go to **Supabase Dashboard** -> **Storage**.
   - Create two public storage buckets:
     1. `invoices` (Public access: Enabled)
     2. `receipts` (Public access: Enabled)

---

## ☁️ Step 2: Deployment Option A - Free Cloud Hosting (Recommended)

### A. Deploy FastAPI Backend on Render / Railway

#### Using Render:
1. Sign up / log in to [Render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`Neuronauts-Zenesys`).
4. Configure service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add **Environment Variables**:
   - `ENVIRONMENT` = `production`
   - `SUPABASE_URL` = `<your-supabase-url>`
   - `SUPABASE_KEY` = `<your-supabase-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY` = `<your-supabase-service-role-key>`
   - `SUPABASE_STORAGE_BUCKET` = `invoices`
   - `GEMINI_API_KEY` = `<your-gemini-api-key>`
   - `GEMINI_MODEL` = `gemini-2.0-flash`
6. Deploy! Render will provide a service URL (e.g. `https://finova-backend.onrender.com`).

---

### B. Deploy React Frontend on Vercel / Netlify

#### Using Vercel:
1. Sign up / log in to [Vercel.com](https://vercel.com/).
2. Click **Add New Project** and import your GitHub repository.
3. Set **Framework Preset**: `Vite`.
4. Set **Root Directory**: `frontend`.
5. Add **Environment Variables**:
   - `VITE_SUPABASE_URL` = `<your-supabase-url>`
   - `VITE_SUPABASE_ANON_KEY` = `<your-supabase-anon-key>`
   - `VITE_API_BASE_URL` = `https://finova-backend.onrender.com` (Your deployed Render backend URL)
6. Click **Deploy**. Vercel will build and host your production frontend.

---

## 🐳 Step 3: Deployment Option B - Docker Compose (VPS / Server)

If deploying to an AWS EC2, DigitalOcean Droplet, or Linux VPS:

1. Clone the repository on your server:
   ```bash
   git clone https://github.com/<your-username>/Neuronauts-Zenesys.git
   cd Neuronauts-Zenesys
   ```

2. Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   GEMINI_API_KEY=your-gemini-api-key
   GEMINI_MODEL=gemini-2.0-flash
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Launch containers:
   ```bash
   docker-compose up --build -d
   ```

4. Verify containers running:
   ```bash
   docker-compose ps
   ```

---

## ✅ Step 4: Verification & Testing

Once deployed:
1. **Backend Health Check**:
   Navigate to `https://<your-backend-url>/health` (or `http://localhost:8000/health`).
   Expected Response:
   ```json
   {"status": "online", "app": "FINOVA Intelligence Engine", "model": "gemini-2.0-flash"}
   ```

2. **Backend API Documentation**:
   Navigate to `https://<your-backend-url>/docs` to view interactive OpenAPI / Swagger UI.

3. **Frontend Application**:
   Open your deployed Vercel URL or `http://localhost:80`.
   Verify project dashboard, vendor list, invoice upload, and AI recommendations load cleanly!
