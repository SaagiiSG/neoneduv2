# How to Disable Email Confirmation in Supabase

## Option 1: Disable Email Confirmation (Recommended for Development)

### Step 1: Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your project (`yaavcdsgdlnqfzouiygm.supabase.co`)

### Step 2: Authentication Settings
1. In the left sidebar, click **"Authentication"**
2. Click **"Settings"**
3. Look for **"Enable email confirmations"**
4. **Uncheck this option** to disable email confirmation

### Step 3: Test Sign In
1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Already have an admin account? Sign In"
3. Use your credentials:
   - Email: `saranochir.s@gmail.com`
   - Password: `Saagii21$`

## Option 2: Get Service Role Key (For Advanced Operations)

### Step 1: Get the Key
1. Go to **Settings** → **API**
2. Copy the **"service_role secret"** key
3. Add it to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY=your_key_here`

### Step 2: Run Email Confirmation Script
```bash
node scripts/confirm-email.js
```

## Option 3: Check Your Email
1. Check `saranochir.s@gmail.com`
2. Look for email from Supabase
3. Click the confirmation link
4. Then sign in

## Recommendation
For development, **Option 1** (disable email confirmation) is the simplest and fastest.




























