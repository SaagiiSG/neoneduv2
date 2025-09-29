import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('EmailJS can only be used in the browser environment');
    }

    // Dynamic import EmailJS only when needed
    const emailjs = (await import('@emailjs/browser')).default;
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Validate configuration
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS configuration is missing. Please check environment variables.');
    }

    // Prepare template parameters
    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      to_email: 'neon.edu.mn@gmail.com', // Your business email
      subject: `New Contact Form Submission from ${formData.firstName} ${formData.lastName}`,
    };

    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', result);
    return { success: true };

  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
};

// Alternative method for sending emails (if you prefer a more direct approach)
export const sendEmailDirectly = async (formData: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const templateParams = {
      user_name: `${formData.firstName} ${formData.lastName}`,
      user_email: formData.email,
      user_phone: formData.phone,
      message: formData.message,
      reply_to: formData.email,
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    return { success: true };

  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
};