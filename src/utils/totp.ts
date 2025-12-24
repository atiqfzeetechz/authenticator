import CryptoJS from 'crypto-js';
import * as Base32 from 'hi-base32';

// Decode base32 secret
function base32Decode(encoded: string): Uint8Array {
  const cleaned = encoded.replace(/\s/g, '').toUpperCase();
  const bytes = Base32.decode.asBytes(cleaned);
  return new Uint8Array(bytes);
}

// Convert counter to 8-byte array
function counterToBytes(counter: number) {
  const bytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    bytes[i] = counter & 0xff;
    counter = counter >> 8;
  }
  return bytes;
}

// Convert Uint8Array to WordArray (CryptoJS format)
function bytesToWordArray(bytes: Uint8Array) {
  const words = [];
  for (let i = 0; i < bytes.length; i += 4) {
    words.push(
      ((bytes[i] << 24) | ((bytes[i + 1] || 0) << 16) | ((bytes[i + 2] || 0) << 8) | (bytes[i + 3] || 0)) >>> 0
    );
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

// Main TOTP generator
export function generateTOTP(secret: string): string {
  try {
    const key = base32Decode(secret);
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / 30);

    const counterBytes = counterToBytes(counter);
    const keyWA = bytesToWordArray(key);
    const counterWA = bytesToWordArray(counterBytes);

    const hmac = CryptoJS.HmacSHA1(counterWA, keyWA);
    const hmacBytes = new Uint8Array(hmac.sigBytes);
    for (let i = 0; i < hmac.sigBytes; i++) {
      hmacBytes[i] = (hmac.words[Math.floor(i / 4)] >>> (8 * (3 - (i % 4)))) & 0xff;
    }

    const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
    const code =
      ((hmacBytes[offset] & 0x7f) << 24) |
      ((hmacBytes[offset + 1] & 0xff) << 16) |
      ((hmacBytes[offset + 2] & 0xff) << 8) |
      (hmacBytes[offset + 3] & 0xff);

    const otp = code % 1_000_000;
    return otp.toString().padStart(6, '0');
  } catch (err) {
    console.error('TOTP error', err);
    return '------';
  }
}

// Remaining seconds
export function getTimeRemaining(): number {
  const epoch = Math.floor(Date.now() / 1000);
  return 30 - (epoch % 30);
}
