// Service to handle sending OTP via EmailJS and strictly verifying it
export interface EmailOtpResult {
  success: boolean;
  message: string;
}

interface ActiveOtpSession {
  email: string;
  otp: string;
  expiresAt: number;
}

let activeSession: ActiveOtpSession | null = null;

export const EmailOtpService = {
  // Generate random 6-digit code
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Check if EmailJS environment variables are configured
  isConfigured(): boolean {
    const metaEnv = (import.meta as any).env || {};
    const serviceId = metaEnv.VITE_EMAILJS_SERVICE_ID;
    const templateId = metaEnv.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = metaEnv.VITE_EMAILJS_PUBLIC_KEY;
    return Boolean(serviceId && templateId && publicKey);
  },

  // Send OTP to email via EmailJS API
  async sendOtp(toEmail: string): Promise<EmailOtpResult> {
    const metaEnv = (import.meta as any).env || {};
    const serviceId = metaEnv.VITE_EMAILJS_SERVICE_ID;
    const templateId = metaEnv.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = metaEnv.VITE_EMAILJS_PUBLIC_KEY;

    const otp = this.generateOtp();
    // 5 minutes expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;
    activeSession = {
      email: toEmail.toLowerCase().trim(),
      otp,
      expiresAt
    };

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS keys are not configured in .env');
      console.info(`[DEV / TEST OTP]: Your OTP is ${otp} (sent to ${toEmail})`);
      return {
        success: false,
        message: 'EmailJS is not configured yet. Please add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.'
      };
    }

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: toEmail,
            email: toEmail,
            recipient: toEmail,
            otp_code: otp,
            passcode: otp,
            code: otp,
            app_name: 'UIU Note Share',
            time: new Date().toLocaleTimeString()
          }
        })
      });

      if (response.ok || response.status === 200) {
        return {
          success: true,
          message: `OTP sent successfully to ${toEmail}. Please check your inbox or spam.`
        };
      } else {
        const errorText = await response.text();
        console.error('EmailJS error:', errorText);
        return {
          success: false,
          message: `Failed to deliver email (${response.status}: ${errorText || 'Check EmailJS setup'}).`
        };
      }
    } catch (err: any) {
      console.error('EmailJS network error:', err);
      return {
        success: false,
        message: err.message || 'Network error while contacting email delivery service.'
      };
    }
  },

  // Strictly verify OTP (No hardcoded/bypass code)
  verifyOtp(inputOtp: string): EmailOtpResult {
    if (!activeSession) {
      return {
        success: false,
        message: 'No active OTP session found. Please request a new OTP code.'
      };
    }

    if (Date.now() > activeSession.expiresAt) {
      activeSession = null;
      return {
        success: false,
        message: 'The OTP code has expired. Please request a new code.'
      };
    }

    const cleanInput = (inputOtp || '').replace(/\D/g, '').trim();
    if (cleanInput === activeSession.otp) {
      activeSession = null; // Invalidate after successful verification
      return {
        success: true,
        message: 'OTP verified successfully!'
      };
    }

    return {
      success: false,
      message: 'Incorrect OTP code. Please check your email and try again.'
    };
  },

  // Get active session email
  getActiveEmail(): string | null {
    return activeSession ? activeSession.email : null;
  },

  // Clear current session
  clearSession(): void {
    activeSession = null;
  }
};
