import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { controllerWrapper } from '../utils/controllerWrapper';

export class AuthController {
  static registerWithEmail = controllerWrapper(
    'Email registration',
    async (req: Request, res: Response) => {
      const tokens = await AuthService.registerUserWithEmail(req.body);
      res.status(201).json(tokens);
    },
  );

  static registerWithDevice = controllerWrapper(
    'Device registration',
    async (req: Request, res: Response) => {
      const tokens = await AuthService.registerUserWithDevice(req.body);
      res.status(201).json(tokens);
    },
  );

  static login = controllerWrapper('Login', async (req: Request, res: Response) => {
    const { email, password, deviceId } = req.body;

    let tokens;
    if (deviceId && email) {
      tokens = await AuthService.loginWithEmailAndPassword(email, password, deviceId);
    } else if (deviceId) {
      tokens = await AuthService.loginWithDeviceId(deviceId);
    } else {
      tokens = await AuthService.loginWithEmailAndPassword(email, password);
    }

    res.status(200).json(tokens);
  });

  static refreshToken = controllerWrapper('Refresh token', async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const tokens = await AuthService.refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  });
}
