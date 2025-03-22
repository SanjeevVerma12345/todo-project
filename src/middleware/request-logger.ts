import {NextFunction, Request, Response} from 'express';
import logger from '../config/logger';

/**
 * Middleware to log incoming HTTP requests.
 *
 * This middleware logs the HTTP method and original URL of each incoming request
 * using the configured logger.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} _res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {void}
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

/**
 * Default export of the request logger middleware.
 *
 * This allows the middleware to be imported and used in Express applications.
 */
export default requestLogger;