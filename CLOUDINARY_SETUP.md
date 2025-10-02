# Cloudinary Setup Guide

## 🚀 Quick Start

This guide will help you upload all your website images to Cloudinary for faster loading times.

## Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Sign up or log in to your account
3. On your dashboard, you'll find:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root of your project:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important:** Replace `your_cloud_name_here`, etc. with your actual Cloudinary credentials.

## Step 3: Upload Images to Cloudinary

Run the upload script:

```bash
node upload-to-cloudinary.js
```

This will upload all your images to Cloudinary and create a `cloudinary-upload-results.json` file with the results.

### Images that will be uploaded:

**Hero Carousel Images:**
- Neon Edu v3.png → `neonedu/hero/neon-edu-v3`
- 4.jpg → `neonedu/hero/image-4`
- Neon Edu v3 (1).png → `neonedu/hero/neon-edu-v3-alt`
- Neon Edu v3 Image.png → `neonedu/hero/neon-edu-image`

**Background Images:**
- Australia Hero Neon Edu.png → `neonedu/hero/australia-hero`
- ourServiceBgDots.svg → `neonedu/backgrounds/our-service-bg-dots`
- Australia Dots Neon Edu.svg → `neonedu/backgrounds/australia-dots`
- our focus bg.svg → `neonedu/backgrounds/our-focus-bg`

**Assets:**
- Neon Edu Logo.png → `neonedu/assets/logo`
- classroom1.png → `neonedu/assets/classroom1`
- classroom2.svg → `neonedu/assets/classroom2`

**Team Photos:**
- All team member photos → `neonedu/team/*`

## Step 4: Deploy to Vercel

Add the environment variables to your Vercel project:

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these variables:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

4. Redeploy your project

## How It Works

The app will automatically:
- ✅ Use Cloudinary URLs when configured (fast, optimized images)
- ✅ Fall back to local images if Cloudinary is not configured
- ✅ Preload hero images during the loading screen
- ✅ Optimize images with WebP format and proper sizing

## Benefits

- 🚀 **Faster Loading**: Images are served from Cloudinary's global CDN
- 📦 **Automatic Optimization**: WebP format, quality optimization
- 🔄 **Smart Fallback**: Works even without Cloudinary
- 💾 **Reduced Bundle Size**: Images not bundled with your app

## Troubleshooting

### Images not loading from Cloudinary?
- Check your environment variables are set correctly
- Make sure you ran the upload script
- Check browser console for errors

### Still using local images?
- The app automatically falls back to local images if Cloudinary is not configured
- This is by design for development and backup

### Need help?
- Check the `cloudinary-upload-results.json` file for upload status
- Review the console logs when running the upload script


