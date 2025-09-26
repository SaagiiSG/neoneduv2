import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

export interface ContactFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  message: string
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn('EmailJS not configured. Skipping email sending.')
      return false
    }

    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      to_email: 'neon.edu.mn@gmail.com', // Your business email
    }

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', result)
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

// Alternative: Simple email sending using a webhook or third-party service
export const sendEmailViaWebhook = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // You can use services like:
    // - Zapier webhook
    // - IFTTT webhook
    // - Formspree
    // - Netlify Forms
    // - Custom webhook endpoint
    
    const webhookUrl = process.env.NEXT_PUBLIC_EMAIL_WEBHOOK_URL
    
    if (!webhookUrl) {
      console.warn('Email webhook not configured.')
      return false
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'neonedu-website'
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Webhook email sending failed:', error)
    return false
  }
}
