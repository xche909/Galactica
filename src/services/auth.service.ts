import prisma from '../config/db';
import { HashUtil } from '../utils/hash';
import * as JwtUtil from '../utils/jwt';
import logger from '../utils/logger';

export class AuthService {
  static async registerUserWithEmail(data: any) {
    // Log the registration attempt
    logger.info(
      `[Email registration] Attempting to register user with email: ${JSON.stringify(data)}`,
    );

    // If deviceId is provided, check for existing device user
    if (data.deviceId) {
      const existingDeviceUser = await prisma.user.findUnique({
        where: { deviceId: data.deviceId },
      });

      if (existingDeviceUser) {
        // Check if email is already taken by another user
        const emailTaken = await prisma.user.findUnique({
          where: { email: data.email },
        });
        if (emailTaken && emailTaken.id !== existingDeviceUser.id) {
          logger.warn(`[Email registration] Email already in use: ${data.email}`);
          const error: any = new Error('Email already in use');
          error.statusCode = 409;
          throw error;
        }

        // Update the existing device user with email registration data
        const hashed = await HashUtil.hashPassword(data.password);
        const updatedUser = await prisma.user.update({
          where: { deviceId: data.deviceId },
          data: {
            ...data,
            password: hashed,
            type: 'EMAIL',
          },
        });

        const tokens = await AuthService.generateTokens(updatedUser);
        return tokens;
      }
      // If deviceId not found, fall through to normal registration
    }

    // Normal registration flow
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      logger.warn(`[Email registration] User already exists with email: ${data.email}`);
      const error: any = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    const hashed = await HashUtil.hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashed,
        type: 'EMAIL',
      },
    });

    const tokens = await AuthService.generateTokens(user);
    return tokens;
  }

  static async registerUserWithDevice(data: any) {
    // Log the registration attempt
    logger.info(
      `[Device registration] Attempting to register user with device ID: ${JSON.stringify(data)}`,
    );

    const existingUser = await prisma.user.findUnique({
      where: { deviceId: data.deviceId },
    });

    if (existingUser) {
      logger.warn(`[Device registration] User already exists with device ID: ${data.deviceId}`);
      const error: any = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    const user = await prisma.user.create({
      data: {
        ...data,
        email: data.deviceId + '@galacticadevice.com',
        type: 'DEVICE',
      },
    });

    const tokens = await AuthService.generateTokens(user);
    return tokens;
  }

  static async loginWithDeviceId(deviceId: string) {
    // Log the login attempt
    logger.info(`[Log in] Attempting to login user with device ID: ${deviceId}`);

    const user = await prisma.user.findUnique({
      where: { deviceId },
    });

    if (!user) {
      logger.warn(`[Log in] No user found with device ID: ${deviceId}`);
      const error: any = new Error('Invalid device ID');
      error.statusCode = 401;
      throw error;
    }

    // Only allow login if user type is DEVICE
    if (user.type !== 'DEVICE') {
      logger.warn(`[Log in] User with device ID: ${deviceId} is not of type DEVICE`);
      const error: any = new Error('Device login not allowed for this user');
      error.statusCode = 403;
      throw error;
    }

    // Update the lastActiveAt field to the current time
    await prisma.user.update({
      where: { deviceId },
      data: { lastActiveAt: new Date() },
    });

    const tokens = await AuthService.generateTokens(user);
    return tokens;
  }

  static async loginWithEmailAndPassword(email: string, password: string, deviceId?: string) {
    // Log the login attempt
    logger.info(`[Log in] Attempting to login user with email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password || !(await HashUtil.checkPassword(password, user.password))) {
      logger.warn(`[Log in] Invalid email or password for user: ${email}`);
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Update the lastActiveAt field to the current time
    await prisma.user.update({
      where: { email },
      data: { lastActiveAt: new Date(), deviceId: deviceId || user.deviceId },
    });

    const tokens = await AuthService.generateTokens(user);
    return tokens;
  }

  static async generateTokens(user: any) {
    // Log the token generation attempt
    logger.info(`Generating tokens for user ID: ${user.id}`);

    // Exclude the refreshToken field from the user object
    const { refreshToken: _, ...userWithoutRefreshToken } = user;

    const accessToken = JwtUtil.signToken(userWithoutRefreshToken);
    const refreshToken = JwtUtil.signRefreshToken(userWithoutRefreshToken);

    // Save the refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, lastActiveAt: new Date() },
    });

    return { accessToken, refreshToken };
  }

  static async refreshAccessToken(refreshToken: string) {
    // Log the refresh token attempt
    logger.info(
      `[Refresh token] Attempting to refresh access token with refresh token: ${refreshToken}`,
    );

    const payload: any = JwtUtil.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.user.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      logger.warn(
        `[Refresh token] Invalid refresh token for user ID: ${payload.user.id} or refresh token mismatch`,
      );
      const error: any = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }

    return AuthService.generateTokens(user);
  }
}
