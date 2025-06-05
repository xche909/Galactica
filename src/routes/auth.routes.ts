import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

router.post(
  '/register/email',
  AuthMiddleware.validateEmailRegistration,
  AuthController.registerWithEmail,
);
router.post(
  '/register/device',
  AuthMiddleware.validateDeviceRegistration,
  AuthController.registerWithDevice,
);
router.post('/login', AuthMiddleware.validateLogin, AuthController.login);
router.post('/refresh-token', AuthMiddleware.validateRefreshToken, AuthController.refreshToken);

export default router;
