import { HashUtil } from '../utils/hash';
import bcrypt from 'bcryptjs';

describe('Hash utils', () => {
  const password = 'supersecret123';

  describe('HashUtil.hashPassword', () => {
    it('should hash the password', async () => {
      const hash = await HashUtil.hashPassword(password);
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce a hash that can be verified', async () => {
      const hash = await HashUtil.hashPassword(password);
      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });
  });

  describe('HashUtil.checkPassword', () => {
    it('should return true for correct password and hash', async () => {
      const hash = await HashUtil.hashPassword(password);
      const result = await HashUtil.checkPassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hash = await HashUtil.hashPassword(password);
      const result = await HashUtil.checkPassword('wrongPassword', hash);
      expect(result).toBe(false);
    });
  });
});
