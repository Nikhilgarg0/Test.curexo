import emailjs from '@emailjs/browser';

// Initialize EmailJS with user ID
export const initEmailJS = () => {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID || '');
};

// Send verification email

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      {
        to_email: email,
        otp: otp,
      }
    );
    return { success: true, response };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};