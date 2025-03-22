import {Router} from 'express';
import {HealthController} from "../controllers/health-controller";

/**
 * Express Router for health-related endpoints.
 *
 * This router handles requests to the /health endpoint, providing information
 * about the application's health status.
 */
const router = Router();

/**
 * Instance of the HealthController to handle health-related requests.
 */
const healthController = new HealthController();

/**
 * Route for retrieving the application's health status.
 *
 * @route GET /health
 * @group Health - Operations related to application health
 * @returns {object} 200 - Success response with health status
 */
router.get('/health', healthController.getHealthStatus);

/**
 * Exports the health router.
 *
 * This allows the router to be used in the main Express application.
 */
export default router;