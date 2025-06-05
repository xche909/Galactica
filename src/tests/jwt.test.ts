import jwt from 'jsonwebtoken';
import { signToken, signRefreshToken, verifyToken, verifyRefreshToken } from '../utils/jwt';

const mockUser = { id: '123', email: 'test@example.com' };

// Mock secrets for testing
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

describe('JWT utils', () => {
  describe('signToken', () => {
    it('should sign a token with the default expiration', () => {
      const token = signToken(mockUser);
      expect(typeof token).toBe('string');
    });

    it('should produce a valid JWT', () => {
      const token = signToken(mockUser, '1h');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      expect((decoded as any).user).toEqual(mockUser);
    });
  });

  describe('signRefreshToken', () => {
    it('should sign a refresh token with the default expiration', () => {
      const token = signRefreshToken(mockUser);
      expect(typeof token).toBe('string');
    });

    it('should produce a valid refresh JWT', () => {
      const token = signRefreshToken(mockUser, '2d');
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
      expect((decoded as any).user).toEqual(mockUser);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = signToken(mockUser);
      const decoded = verifyToken(token);
      expect((decoded as any).user).toEqual(mockUser);
    });

    it('should throw on invalid token', () => {
      expect(() => verifyToken('invalid.token')).toThrow('Invalid token');
    });

    it('should throw on expired token', () => {
      const expiredToken = jwt.sign({ user: mockUser }, process.env.JWT_SECRET!, {
        expiresIn: '1ms',
      });

      setTimeout(() => {}, 100);

      expect(() => verifyToken(expiredToken)).toThrow('Token expired');
    });

    it('should throw on tampered token', () => {
      const token = signToken(mockUser);
      const tamperedToken = token.slice(0, -1) + 'x';
      expect(() => verifyToken(tamperedToken)).toThrow('Invalid token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = signRefreshToken(mockUser);
      const decoded = verifyRefreshToken(token);
      expect((decoded as any).user).toEqual(mockUser);
    });

    it('should throw on invalid refresh token', () => {
      expect(() => verifyRefreshToken('invalid.token')).toThrow('Invalid refresh token');
    });

    it('should throw on expired refresh token', () => {
      const expiredToken = jwt.sign({ user: mockUser }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: '1ms',
      });

      setTimeout(() => {}, 100);

      expect(() => verifyRefreshToken(expiredToken)).toThrow('Refresh token expired');
    });

    it('should throw on tampered refresh token', () => {
      const token = signRefreshToken(mockUser);
      const tamperedToken = token.slice(0, -1) + 'x';
      expect(() => verifyRefreshToken(tamperedToken)).toThrow('Invalid refresh token');
    });
  });
});
