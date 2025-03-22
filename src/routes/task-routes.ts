import express from 'express';
import {TaskController} from '../controllers/task-controller';
import {TaskService} from '../services/task-service';
import {TaskRepository} from '../repositories/task-repository';

/**
 * Express Router for task-related endpoints.
 *
 * This router handles requests related to task management, including
 * retrieving, creating, updating, and deleting tasks.
 */
const router = express.Router();

/**
 * TaskController instance with injected TaskService and TaskRepository dependencies.
 */
const taskController = new TaskController(new TaskService(new TaskRepository()));

/**
 * Route for retrieving all tasks.
 *
 * @route GET /tasks
 * @group Tasks - Operations related to task management
 * @returns {Array<object>} 200 - An array of tasks
 */
router.get(`/`, taskController.getTasks);

/**
 * Route for retrieving a specific task by ID.
 *
 * @route GET /tasks/:id
 * @group Tasks - Operations related to task management
 * @param {string} id.path.required - The ID of the task to retrieve.
 * @returns {object} 200 - The requested task
 * @returns {object} 404 - Task not found
 */
router.get(`/:id`, taskController.getTask);

/**
 * Route for deleting a task by ID.
 *
 * @route DELETE /tasks/:id
 * @group Tasks - Operations related to task management
 * @param {string} id.path.required - The ID of the task to delete.
 * @returns {object} 204 - No content (successful deletion)
 * @returns {object} 404 - Task not found
 */
router.delete(`/:id`, taskController.deleteTask);

/**
 * Route for creating a new task.
 *
 * @route POST /tasks
 * @group Tasks - Operations related to task management
 * @param {object} task.body.required - The task data to create.
 * @returns {object} 201 - The created task
 */
router.post(`/`, taskController.createTask);

/**
 * Route for updating an existing task by ID.
 *
 * @route PUT /tasks/:id
 * @group Tasks - Operations related to task management
 * @param {string} id.path.required - The ID of the task to update.
 * @param {object} task.body.required - The updated task data.
 * @returns {object} 200 - The updated task
 * @returns {object} 404 - Task not found
 */
router.put(`/:id`, taskController.updateTask);

/**
 * Exports the task router.
 *
 * This allows the router to be used in the main Express application.
 */
export default router;