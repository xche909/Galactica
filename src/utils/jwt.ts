import jwt from 'jsonwebtoken';

const secret: jwt.Secret = process.env.JWT_SECRET!;
const refreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET!;

export function signToken(user: any, expiresIn: string = '15m') {
  return jwt.sign({ user }, process.env.JWT_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
}

export function signRefreshToken(user: any, expiresIn: string = '7d') {
  return jwt.sign(
    { user },
    process.env.JWT_REFRESH_SECRET as jwt.Secret,
    { expiresIn } as jwt.SignOptions,
  );
}

export function verifyToken(token: string): object | string {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const error: any = new Error('Token expired');
      error.statusCode = 401;
      throw error;
    } else if (error instanceof jwt.JsonWebTokenError) {
      const error: any = new Error('Invalid token');
      error.statusCode = 401;
      throw error;
    } else {
      throw error;
    }
  }
}

export function verifyRefreshToken(token: string): object | string {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const error: any = new Error('Refresh token expired');
      error.statusCode = 401;
      throw error;
    } else if (error instanceof jwt.JsonWebTokenError) {
      const error: any = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    } else {
      throw error;
    }
  }
}
