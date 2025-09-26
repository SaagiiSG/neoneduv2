# 🚀 Admin Panel Quick Start Guide

## Step 1: Extract Data from Your Website
```bash
npm run extract-data
```
This extracts all your team members, courses, and study abroad data from `page.tsx`.

## Step 2: Set Up Your Database Tables
Go to your Supabase dashboard and run these SQL commands:

```sql
-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    image TEXT NOT NULL,
    bio TEXT NOT NULL CHECK (length(bio) <= 500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL CHECK (length(description) <= 1000),
    link TEXT NOT NULL CHECK (link ~ '^https?://.+'),
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Abroad Table
CREATE TABLE IF NOT EXISTS study_abroad (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_name VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT NOT NULL CHECK (length(description) <= 1000),
    link TEXT NOT NULL CHECK (link ~ '^https?://.+'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    address TEXT NOT NULL CHECK (length(address) <= 500),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_contact_info UNIQUE (id)
);

-- Social Media Links Table
CREATE TABLE IF NOT EXISTS contact_info_socials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_info_id UUID NOT NULL REFERENCES contact_info(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL CHECK (url ~ '^https?://.+'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contact_info_id, platform)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_abroad_updated_at 
    BEFORE UPDATE ON study_abroad 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at 
    BEFORE UPDATE ON contact_info 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 3: Create Admin User
```bash
npm run create-admin
```

## Step 4: Start Your Development Server
```bash
npm run dev
```

## Step 5: Populate Database with Your Data
```bash
npm run populate-db
```

## Step 6: Access Admin Panel
1. Go to: `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@neonedu.com`
   - Password: `admin123`
3. You'll be redirected to the dashboard

## 🎯 What You Can Do Now:

### Team Members Management
- View all 7 team members from your website
- Add new team members
- Edit existing team member details
- Delete team members
- Upload profile images

### Courses Management
- View all 3 courses from your website
- Add new courses
- Edit course details and categories
- Delete courses

### Study Abroad Programs
- View all 6 country programs
- Add new study destinations
- Edit program details
- Delete programs

### Contact Information
- Update company contact details
- Add/remove social media links
- Copy contact info to clipboard
- Manage address, phone, and email

## 🔧 API Endpoints Available:
- `GET/POST /api/team-members`
- `GET/POST /api/courses`
- `GET/POST /api/study-abroad`
- `GET/PUT /api/contact-info`
- `POST/DELETE /api/contact-info/socials`

## 🎉 You're All Set!
Your admin panel is now fully functional with all your real data from the website. You can manage everything through the clean, modern interface!


