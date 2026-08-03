import crypto from 'crypto';

export const generateTemporaryPassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*';

  const getRandomChar = (chars: string) =>
    chars[crypto.randomInt(0, chars.length)];

  const requiredChars = [
    getRandomChar(lowercase),
    getRandomChar(uppercase),
    getRandomChar(numbers),
    getRandomChar(specialChars),
  ];

  const allChars = lowercase + uppercase + numbers + specialChars;
  const remainingLength = 10 - requiredChars.length;

  const remainingChars = Array.from({ length: remainingLength }, () =>
    getRandomChar(allChars),
  );

  const passwordArray = [...requiredChars, ...remainingChars];

  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join('');
};
