export interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    // First try the server-side API route
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Email sent successfully via API route');
      return { success: true };
    } else {
      console.log('API route failed, trying EmailJS fallback:', result.error);
      // Fall back to EmailJS
      return await sendEmailViaEmailJS(formData);
    }

  } catch (error) {
    console.log('API route error, trying EmailJS fallback:', error);
    // Fall back to EmailJS
    return await sendEmailViaEmailJS(formData);
  }
};

const sendEmailViaEmailJS = async (formData: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('EmailJS can only be used in the browser environment');
    }

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    console.log('EmailJS Config:', {
      serviceId: EMAILJS_SERVICE_ID ? 'Present' : 'Missing',
      templateId: EMAILJS_TEMPLATE_ID ? 'Present' : 'Missing',
      publicKey: EMAILJS_PUBLIC_KEY ? 'Present' : 'Missing'
    });

    // Validate configuration
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS configuration is missing. Please check environment variables.');
    }

    // Import EmailJS dynamically only in browser
    const { default: emailjs } = await import('@emailjs/browser');
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Prepare template parameters - simplified to avoid validation issues
    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      reply_to: formData.email,
    };

    console.log('Sending email with params:', templateParams);

    // Send email using EmailJS with explicit public key
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully via EmailJS:', result);
    return { success: true };

  } catch (error: any) {
    console.error('EmailJS error:', error);
    
    // More detailed error handling
    let errorMessage = 'Failed to send email';
    
    if (error?.status === 412) {
      errorMessage = 'Email validation failed. Please check your information and try again.';
    } else if (error?.status === 400) {
      errorMessage = 'Invalid email configuration. Please contact support.';
    } else if (error?.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error?.text) {
      errorMessage = error.text;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};
