# Perustamisapuri - Deployment Guide

## 🚀 Recommended: Deploy to Vercel (Free)

Vercel is the best choice for this Next.js application as it's created by the Next.js team and offers seamless deployment.

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/perustamisapuri.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Visit [vercel.com](https://vercel.com)** and sign up with your GitHub account
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `perustamisapuri-app`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 3: Set Environment Variables

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add the following variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Environment**: Production, Preview, Development

### Step 4: Deploy

1. Click **Deploy**
2. Wait for deployment to complete
3. Your app will be available at: `https://your-project-name.vercel.app`

## 🔒 Privacy Configuration (Already Added)

The following privacy measures are already configured in your app:

### 1. robots.txt
```txt
User-agent: *
Disallow: /
```
Located at: `public/robots.txt`

### 2. Meta Tags
```tsx
robots: {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
}
```
Added to: `src/app/layout.tsx`

## 🔧 Alternative Hosting Options

### Railway (Good for full-stack apps)
1. Visit [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

### Netlify (Good for static sites)
1. Visit [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings: `npm run build` and `out` directory
4. Deploy

## 📋 Pre-Deployment Checklist

- [x] robots.txt added to prevent search engine indexing
- [x] Meta robots tags configured
- [x] Environment variables identified (OPENAI_API_KEY)
- [x] Build configuration verified
- [x] Finnish language and UX maintained

## 🔑 Required Environment Variables

Make sure to set these in your hosting platform:

- `OPENAI_API_KEY`: Your OpenAI API key for chat functionality

## 🌐 Custom Domain (Optional)

If you want a custom domain:
1. Purchase a domain from any registrar
2. In Vercel dashboard, go to **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed

## 🛡️ Security Notes

- The app is publicly accessible but hidden from search engines
- OpenAI API key is securely stored as environment variable
- No sensitive data is stored in the frontend code
- All API calls are server-side only

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Ensure OpenAI API key is valid and has credits
4. Check the build output for any errors

Your Perustamisapuri app will be live and accessible via direct link, but invisible to search engines! 🎉
