export function parseOtpAuth(uri: string) {
  const url = new URL(uri);

  const name = decodeURIComponent(url.pathname.replace('/', ''));
  const secret = url.searchParams.get('secret');

  if (!secret) throw new Error('Invalid QR code');

  return { name, secret };
}
