import {Router} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import taskRoutes from './task-routes';
import subtaskRoutes from './subtask-routes';
import healthRoutes from './health-routes';

const apiPrefix = '/api/v1';
const router = Router();

// API Documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
router.use(`${apiPrefix}/tasks`, taskRoutes);
router.use(`${apiPrefix}/tasks/:id`, subtaskRoutes);

// Health check
router.use(healthRoutes);

export default router;
