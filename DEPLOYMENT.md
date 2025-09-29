# Deployment Guide for Neon Edu

## Vercel Deployment Steps

### 1. Push your code to GitHub
Your code should already be pushed to: `https://github.com/SaagiiSG/neoneduv2.git`

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `SaagiiSG/neoneduv2`
4. Select the main branch

### 3. Environment Variables Setup
Configure these environment variables in Vercel:

**Supabase Configuration:**
- `NEXT_PUBLIC_SUPABASE_URL` = `https://yaavcdsgdlnqfzouiygm.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhYXZjZHNnZGxucWZ6b3VpeWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTQ2OTksImV4cCI6MjA3MjAzMDY5OX0.s_Zp1BOGsL3UgCo4mvsjXyEBATwjJ8eXCdB4J5Wfz5E`
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhYXZjZHNnZGxucWZ6b3VpeWdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1NDY5OSwiZXhwIjoyMDcyMDMwNjk5fQ.23O53X_dv70fDZfxbqcT7zZXVswV0WtUy0gTjKyb7lY`

**Cloudinary Configuration:**
- `CLOUDINARY_CLOUD_NAME` = `dhkd6dl0d`
- `CLOUDINARY_API_KEY` = `165385739939337`
- `CLOUDINARY_API_SECRET` = `ZoZ9s6cPAWwuqzYlT-0NGW2J3GA`

**EmailJS Configuration:**
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` = `service_4pqhkg8`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` = `template_2bm8u66`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` = `oIzav3nEHzXvE0_mo`

### 4. Build Settings
Vercel will automatically detect Next.js and configure:
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 5. Deploy
Click "Deploy" and Vercel will:
1. Install dependencies
2. Build your application
3. Deploy to a global CDN

### 6. Domain Setup
- Vercel will assign a random domain initially (e.g., `neoneduv2.vercel.app`)
- You can add a custom domain in Project Settings > Domains

## Troubleshooting

### Build Issues
If you encounter build errors:
1. Check environment variables are set correctly
2. Verify Supabase connection
3. Check Vercel build logs for specific errors

### Environment Variables
Make sure all required environment variables are set in Vercel:
- Go to Project Settings > Environment Variables
- Add all variables listed above

### Next Steps After Deployment
1. Test all functionality on the deployed site
2. Set up custom domain if needed
3. Configure Supabase policies for production
4. Test contact form functionality

## Security Notes
- Never commit `.env.local` or actual API keys
- The service role key should be private
- Consider implementing rate limiting for production
- Monitor API usage on Supabase dashboard
