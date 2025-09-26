# Neon Edu Admin Panel Setup

This document provides instructions for setting up the admin panel for Neon Edu.

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL migrations in your Supabase SQL editor:

1. `server/database/migrations/001_create_team_members.sql`
2. `server/database/migrations/002_create_courses.sql`
3. `server/database/migrations/003_create_study_abroad.sql`
4. `server/database/migrations/004_create_contact_info.sql`

### 4. Seed Data (Optional)

```bash
npm run seed
```

### 5. Start Backend Server

```bash
npm run dev
```

## Frontend Setup (Next.js)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Add to your existing `.env.local` file:

```env
# Add these to your existing Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Start Development Server

```bash
npm run dev
```

## Admin Panel Access

1. Navigate to `http://localhost:3000/admin/login`
2. You'll need to set up authentication in Supabase first
3. After login, you'll be redirected to `http://localhost:3000/admin/dashboard`

## Authentication Setup

### 1. Enable Email Authentication in Supabase

1. Go to your Supabase dashboard
2. Navigate to Authentication > Settings
3. Enable Email authentication
4. Configure email templates if needed

### 2. Create Admin User

1. Go to Authentication > Users in Supabase dashboard
2. Click "Add User"
3. Create an admin user with email and password
4. Note the user's email for login

### 3. Test Login

1. Go to `http://localhost:3000/admin/login`
2. Enter your admin email and password
3. You should be redirected to the admin dashboard
4. If you try to access `/admin/dashboard` directly without login, you'll be redirected to the login page

## Features

### Admin Dashboard
- Overview of all sections
- Quick access to manage content
- Statistics display

### Team Members Management
- Add, edit, delete team members
- Upload profile images via URL
- Manage roles and bios

### Courses Management
- Add, edit, delete courses
- Categorize courses
- Add course links and descriptions

### Study Abroad Management
- Manage international programs
- Add program details and links
- Organize by country

### Contact Information
- Update company contact details
- Manage social media links
- Copy-to-clipboard functionality for contact info

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password

### Team Members
- `GET /api/team-members` - Get all team members
- `GET /api/team-members/:id` - Get single team member
- `POST /api/team-members` - Create team member
- `PUT /api/team-members/:id` - Update team member
- `DELETE /api/team-members/:id` - Delete team member

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Study Abroad
- `GET /api/study-abroad` - Get all programs
- `GET /api/study-abroad/:id` - Get single program
- `POST /api/study-abroad` - Create program
- `PUT /api/study-abroad/:id` - Update program
- `DELETE /api/study-abroad/:id` - Delete program

### Contact Info
- `GET /api/contact-info` - Get contact information
- `PUT /api/contact-info` - Update contact information
- `POST /api/contact-info/socials` - Add social media link
- `DELETE /api/contact-info/socials/:id` - Remove social media link

## Security Notes

- All admin routes require authentication
- Service role key is used for admin operations
- CORS is configured for the frontend URL
- Rate limiting is implemented

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check your Supabase URL and keys
2. **Authentication issues**: Ensure email auth is enabled in Supabase
3. **CORS errors**: Verify FRONTEND_URL in server .env matches your Next.js dev server
4. **API errors**: Check server logs for detailed error messages

### Support

For issues or questions, check the server logs and browser console for detailed error messages.
