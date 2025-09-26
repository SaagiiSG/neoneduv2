# 🖼️ Cloudinary Setup Guide

## 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

## 2. Get Your Credentials
1. Go to your Cloudinary Dashboard
2. Copy your **Cloud Name**, **API Key**, and **API Secret**
3. Add them to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 3. Features Included
- ✅ **Image Upload**: Drag & drop or click to upload
- ✅ **Automatic Optimization**: Images are automatically optimized for web
- ✅ **Multiple Formats**: Supports PNG, JPG, GIF, WebP
- ✅ **Size Validation**: Max 5MB file size
- ✅ **Preview**: Real-time preview before upload
- ✅ **Delete**: Remove images from Cloudinary when deleting records

## 4. Image Storage Structure
```
neonedu/
├── team-members/
├── courses/
├── study-abroad/
└── contact-info/
```

## 5. Benefits
- **No More Broken Links**: Images stored in cloud, not local files
- **Better Performance**: Cloudinary optimizes images automatically
- **CDN Delivery**: Fast image loading worldwide
- **Backup**: Images are safely stored in cloud
- **Easy Management**: Upload, delete, and manage images through admin panel

## 6. Usage in Admin Panel
1. **Upload**: Click or drag images to upload
2. **Preview**: See image before saving
3. **Change**: Replace images easily
4. **Delete**: Remove images when deleting records

Your images will be automatically uploaded to Cloudinary and the URLs will be stored in your Supabase database!


