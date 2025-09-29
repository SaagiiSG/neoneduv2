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

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    // Validate configuration
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS configuration is missing. Please check environment variables.');
    }

    // Import EmailJS dynamically only in browser
    const { default: emailjs } = await import('@emailjs/browser');
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Use the most common EmailJS template parameter names
    const templateParams = {
      user_name: `${formData.firstName} ${formData.lastName}`,
      user_email: formData.email,
      user_phone: formData.phone,
      message: formData.message,
      reply_to: formData.email,
      to_email: 'neon.edu.mn@gmail.com',
    };

    console.log('Sending email with EmailJS:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      params: templateParams
    });

    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    return { success: true };

  } catch (error: any) {
    console.error('EmailJS error:', error);
    
    // Detailed error handling
    let errorMessage = 'Failed to send email';
    
    if (error?.status === 412) {
      errorMessage = 'Email template validation failed. Please check your EmailJS template configuration.';
    } else if (error?.status === 400) {
      errorMessage = 'Invalid request. Please check your EmailJS service configuration.';
    } else if (error?.status === 429) {
      errorMessage = 'Too many requests. Please try again in a few minutes.';
    } else if (error?.text) {
      errorMessage = `EmailJS Error: ${error.text}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};
