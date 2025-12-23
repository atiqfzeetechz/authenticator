import { authenticator } from 'otplib';

export function generateTOTP(secret: string): string {
  try {
    return authenticator.generate(secret);
  } catch (error) {
    console.error('Error generating TOTP:', error);
    return '000000';
  }
}

export function parseQRCode(qrData: string): { secret: string; issuer: string; accountName: string } | null {
  try {
    const url = new URL(qrData);
    
    if (url.protocol !== 'otpauth:' || url.hostname !== 'totp') {
      return null;
    }
    
    const secret = url.searchParams.get('secret');
    const issuer = url.searchParams.get('issuer') || 'Unknown';
    const accountName = decodeURIComponent(url.pathname.substring(1));
    
    if (!secret) {
      return null;
    }
    
    return { secret, issuer, accountName };
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
}