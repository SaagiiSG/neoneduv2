# EmailJS Setup Instructions

## 1. Create EmailJS Account and Service

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new service (Gmail, Outlook, etc.)
4. Create an email template for contact form submissions

## 2. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## 3. Email Template Variables

Your EmailJS template should use these variables:

- `{{from_name}}` - Full name (firstName + lastName)
- `{{from_email}}` - User's email address
- `{{phone}}` - User's phone number
- `{{message}}` - User's message
- `{{to_email}}` - Your business email
- `{{subject}}` - Email subject line

## 4. Sample Email Template

**Subject:** `{{subject}}`

**Body:**
```
New contact form submission from Neon Edu website:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

---
This message was sent from the Neon Edu contact form.
```

## 5. Testing

After setting up the environment variables, the contact form will automatically use EmailJS to send emails.

## 6. Security Notes

- The EmailJS public key is safe to expose in the frontend
- Consider setting up email rate limiting in your EmailJS account
- Monitor your email usage to avoid hitting limits on the free plan