# Email Setup Instructions

## Contact Form Email Functionality

The contact form is now functional and will:
1. Store submissions in your Supabase database
2. Send email notifications (when configured)

## Email Service Options

### Option 1: EmailJS (Recommended for quick setup)
1. Go to [EmailJS](https://www.emailjs.com/)
2. Create a free account
3. Set up an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Add these environment variables to your `.env.local`:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### Option 2: Webhook Service
1. Set up a webhook service (Zapier, IFTTT, etc.)
2. Add this environment variable to your `.env.local`:

```env
NEXT_PUBLIC_EMAIL_WEBHOOK_URL=your_webhook_url
```

### Option 3: Server-side Email Service
For production, consider integrating with:
- SendGrid
- Resend
- Nodemailer with SMTP

## Database Setup

Make sure your Supabase database has a `contact_submissions` table with these columns:

```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Current Status

✅ Contact form submissions are stored in Supabase
✅ Form validation is working
✅ Loading states are implemented
⏳ Email notifications (requires configuration)

The form will work without email configuration - submissions will be stored in the database and you can check them manually or set up email notifications later.
