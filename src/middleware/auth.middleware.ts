import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware {
  static validateEmailRegistration = [
    // Validate fields
    body('firstName').trim().notEmpty().withMessage('First name is required'),

    body('lastName').trim().notEmpty().withMessage('Last name is required'),

    body('email').isEmail().withMessage('Valid email is required'),

    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[a-z]/)
      .withMessage('Password must include at least one lowercase letter.')
      .matches(/[A-Z]/)
      .withMessage('Password must include at least one uppercase letter.'),

    // Check for errors
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  static validateDeviceRegistration = [
    body('deviceId').isString().withMessage('Device ID must be a string'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  static validateLogin = [
    // Either email/password OR deviceId must be provided
    body().custom((value, { req }) => {
      if ((!req.body.email || !req.body.password) && !req.body.deviceId) {
        throw new Error('Either email/password or deviceId must be provided');
      }
      return true;
    }),

    body('email')
      .if(body('deviceId').not().exists())
      .isEmail()
      .withMessage('Valid email is required when logging in with email/password'),

    body('password')
      .if(body('deviceId').not().exists())
      .trim()
      .notEmpty()
      .withMessage('Password is required'),

    body('deviceId')
      .if(body('email').not().exists())
      .isString()
      .withMessage('Device ID must be a string'),

    // Check for errors
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  static validateRefreshToken = [
    // Validate that the refreshToken field exists and is not empty
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),

    // Check for validation errors
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
}
