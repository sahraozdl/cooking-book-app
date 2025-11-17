import { isValidEmail } from '@/app/lib/utils/validateEmail';

describe('isValidEmail', () => {
  const validEmails = [
    'user@example.com',
    'first.last@example.co.uk',
    'user+tag@gmail.com',
    'user_name@domain.io',
    'user@sub.domain.com',
  ];

  const invalidEmails = [
    'plainaddress',
    '@missingusername.com',
    'username@.com',
    'username@com',
    'username@site..com',
  ];

  test('accepts valid emails', () => {
    validEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  test('rejects invalid emails', () => {
    invalidEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });
});
