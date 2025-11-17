export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (email.includes('..')) return false;
  return emailRegex.test(email);
}
