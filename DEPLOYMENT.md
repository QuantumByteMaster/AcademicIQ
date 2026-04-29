# Deployment Guide (Render)

This guide explains how to deploy both the **Backend (Express)** and **Frontend (Next.js)** to [Render.com](https://render.com).

## Prerequisites

1.  A [Render account](https://dashboard.render.com).
2.  Your GitHub repo connected to Render.
3.  A MongoDB Atlas cluster (allow access from `0.0.0.0/0` in Network Access).

---

## 1. Deploy the Backend (Express)

1.  Click **New +** -> **Web Service**.
2.  Connect your `AcademicIQ` repository.
3.  **Name:** e.g., `academiciq-backend`
4.  **Region:** Choose the one closest to your users (e.g., Oregon, Frankfurt).
5.  **Branch:** `main`
6.  **Root Directory:** `server` (⚠️ Important!)
7.  **Runtime:** `Node`
8.  **Build Command:** `npm install`
9.  **Start Command:** `npm start`
10. **Internal Secret:** Generate a random string (e.g., `openssl rand -hex 32`) and save it. You'll use this for both services.

### Environment Variables (Backend)

Add these in the "Environment" tab:

| Key | Value |
|---|---|
| `PORT` | `5000` (Render might use 10000 internally but this is good practice) |
| `MONGODB_URI` | Your full connection string (e.g. `mongodb+srv://...`) |
| `Internal_API_SECRET` | The random secret you generated |
| `CORS_ORIGINS` | `https://academic-iq.vercel.app` (Add this specific URL!) |
| `GROQ_API_KEY` | Your key |
| `TAVILY_API_KEY` | Your key |
| `HUGGINGFACE_API_KEY` | Your key |

Click **Create Web Service**. Wait for the specific URL (e.g., `https://academiciq-backend-xyz.onrender.com`).

---

## 2. Deploy the Frontend (Next.js)

**(If deploying to Vercel instead of Render)**

1.  Import your GitHub repo to Vercel.
2.  **Framework Preset:** Next.js
3.  **Root Directory:** `.`

### Environment Variables (Frontend)

Add these in Vercel:

| Key | Value |
|---|---|
| `NEXTAUTH_URL` | Your Vercel URL (e.g. `https://academic-iq.vercel.app`) |
| `NEXTAUTH_SECRET` | Generate a random 32-char string (e.g. `openssl rand -base64 32`) |
| `INTERNAL_API_SECRET` | **Must match the backend secret!** |
| `MONGODB_URI` | **Required!** Your full connection string (same as backend) |
| `API_URL` | The *Backend* URL (e.g. `https://academiciq-backend-xyz.onrender.com` - **NO trailing slash**) |
| `BREVO_API_KEY` | Your key |
| `BREVO_FROM_EMAIL` | Verified sender email |
| `NEXT_PUBLIC_POSTHOG_KEY` | (Optional) |
| `NEXT_PUBLIC_POSTHOG_HOST` | (Optional) |
---

## 3. Final Configuration

1.  **Update Backend CORS:**
    *   Go back to your **Backend Service** -> **Environment**.
    *   Update `CORS_ORIGINS` to: `https://academic-iq.vercel.app`

2.  **Verify:**
    *   Visit your Frontend URL.
    *   Try signing up/logging in.
    *   Test a feature that hits the backend (e.g., generate a study plan).

## Troubleshooting

*   **MongoDB Connection Error:** Check Network Access in Atlas. Allow `0.0.0.0/0` (Allow Access from Anywhere) as Render IPs change.
*   **CORS Error:** Check browser console. Ensure Backend `CORS_ORIGINS` matches Frontend URL exactly (https, no slash).
*   **Authentication Failed:** Check `INTERNAL_API_SECRET` matches on both. Check `NEXTAUTH_URL` matches the deployed frontend URL.
