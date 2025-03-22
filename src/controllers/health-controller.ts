import {Request, Response} from 'express';

/**
 * Controller for handling health-related endpoints.
 */
export class HealthController {
  /**
   * Retrieves the current health status of the application.
   *
   * This endpoint returns a JSON object containing the application's health status,
   * current timestamp, and uptime.
   *
   * @param {Request} _req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void} - Sends a JSON response with the health status.
   */
  getHealthStatus(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime().toFixed(2),
    });
  }
}