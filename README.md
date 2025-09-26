# Admin Dashboard

A simple Next.js admin dashboard with Supabase authentication.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ Supabase authentication
- ✅ Single admin user system
- ✅ Responsive design

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API in your Supabase dashboard
3. Copy your project URL and anon key
4. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **First time setup**: Use the "Sign Up" option to create your admin account
2. **Regular login**: Use the "Sign In" option with your admin credentials
3. **Dashboard**: Once logged in, you'll see the admin dashboard with your profile

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Supabase provider
│   ├── page.tsx            # Main admin dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── Auth.tsx            # Authentication component
│   └── UserProfile.tsx     # Admin profile component
├── contexts/
│   └── SupabaseContext.tsx # Supabase authentication context
└── lib/
    └── supabase.ts         # Supabase client configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Notes

- This is designed for single admin user access
- Store your Supabase credentials securely
- Consider adding additional security measures for production use
# neoneduv2
