export interface OTPDeliveryEvent {
  mobile: string;
  countryCode: string;
  fullPhone: string;
  otp: string;
  expiresAt: number;
  timestamp: string;
  message: string;
}

type OTPListener = (event: OTPDeliveryEvent) => void;

class OTPService {
  private activeOTPs: Map<string, { otp: string; expiresAt: number }> = new Map();
  private listeners: Set<OTPListener> = new Set();
  private lastDelivery: OTPDeliveryEvent | null = null;

  constructor() {
    // Restore any active OTPs from storage
    try {
      const saved = localStorage.getItem('needfix_active_otps');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([key, val]: [string, any]) => {
          if (val.expiresAt > Date.now()) {
            this.activeOTPs.set(key, val);
          }
        });
      }
    } catch {
      // ignore
    }
  }

  // Subscribe to real-time OTP delivery
  subscribe(listener: OTPListener): () => void {
    this.listeners.add(listener);
    if (this.lastDelivery && this.lastDelivery.expiresAt > Date.now()) {
      listener(this.lastDelivery);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Generate and send OTP
  async sendOTP(countryCode: string, mobile: string): Promise<{ success: boolean; otp: string; message: string }> {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 7) {
      throw new Error('Please enter a valid mobile number');
    }

    const fullPhone = `${countryCode} ${cleanMobile}`;
    
    // Generate 6-digit OTP (e.g. 482910)
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins validity

    const record = { otp: randomOtp, expiresAt };
    this.activeOTPs.set(fullPhone, record);
    this.activeOTPs.set(cleanMobile, record);

    // Save to storage
    try {
      const obj: Record<string, any> = {};
      this.activeOTPs.forEach((v, k) => {
        if (v.expiresAt > Date.now()) obj[k] = v;
      });
      localStorage.setItem('needfix_active_otps', JSON.stringify(obj));
    } catch {
      // ignore
    }

    const deliveryEvent: OTPDeliveryEvent = {
      mobile: cleanMobile,
      countryCode,
      fullPhone,
      otp: randomOtp,
      expiresAt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: `<#> ${randomOtp} is your NeedFix verification code. Valid for 5 minutes. Do not share with anyone. \nNEEDFIX / 9WkX28hL`,
    };

    this.lastDelivery = deliveryEvent;

    // Notify listeners (SMS popups, toast notifications)
    this.listeners.forEach((listener) => {
      try {
        listener(deliveryEvent);
      } catch (err) {
        console.error('Error notifying OTP listener', err);
      }
    });

    // Also simulate short network latency for realism
    await new Promise((r) => setTimeout(r, 450));

    return {
      success: true,
      otp: randomOtp,
      message: `OTP sent successfully to ${fullPhone}`,
    };
  }

  // Verify OTP
  verifyOTP(countryCode: string, mobile: string, enteredOTP: string): boolean {
    const cleanMobile = mobile.replace(/\D/g, '');
    const fullPhone = `${countryCode} ${cleanMobile}`;
    const trimmedOtp = enteredOTP.trim();

    // Universal bypass code for testing as requested in user prompt
    if (trimmedOtp === '123456' || trimmedOtp === '000000') {
      return true;
    }

    const record = this.activeOTPs.get(fullPhone) || this.activeOTPs.get(cleanMobile);
    if (!record) {
      // In case session restarted, if user enters matching OTP from screen
      if (this.lastDelivery && this.lastDelivery.otp === trimmedOtp) {
        return true;
      }
      return false;
    }

    if (Date.now() > record.expiresAt) {
      return false;
    }

    if (record.otp === trimmedOtp) {
      this.activeOTPs.delete(fullPhone);
      this.activeOTPs.delete(cleanMobile);
      return true;
    }

    return false;
  }

  getLastDelivery(): OTPDeliveryEvent | null {
    if (this.lastDelivery && this.lastDelivery.expiresAt > Date.now()) {
      return this.lastDelivery;
    }
    return null;
  }
}

export const otpService = new OTPService();
