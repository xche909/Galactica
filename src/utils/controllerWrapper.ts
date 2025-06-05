import { Request, Response, NextFunction } from 'express';
import logger from './logger';

/**
 * Wraps a controller function with error handling and logging.
 * @param controllerName - The name of the controller being wrapped.
 * @param fn - The controller function to wrap.
 * @returns A function that handles errors and passes them to the response.
 */
export function controllerWrapper(
  controllerName: string,
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      if (!error.statusCode) {
        logger.error(`[${controllerName}] Unhandled error:`, JSON.stringify(error));
      }
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}
