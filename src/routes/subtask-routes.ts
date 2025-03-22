import {SubtaskController} from '../controllers/subtask-controller';
import {SubtaskService} from '../services/subtask-service';
import express from "express";
import {SubtaskRepository} from "../repositories/subtask-repository";

/**
 * Express Router for subtask-related endpoints.
 *
 * This router handles requests related to subtask management within a specific task,
 * including retrieving, creating, updating, and deleting subtasks.
 */
const router = express.Router({mergeParams: true});

/**
 * SubtaskController instance with injected SubtaskService and TaskRepository dependencies.
 */
const subtaskController = new SubtaskController(new SubtaskService(new SubtaskRepository()));

/**
 * Route for retrieving a specific subtask by ID.
 *
 * @route GET /tasks/:taskId/subtasks/:subtaskId
 * @group Subtasks - Operations related to subtask management
 * @param {string} taskId.path.required - The ID of the parent task.
 * @param {string} subtaskId.path.required - The ID of the subtask to retrieve.
 * @returns {object} 200 - The requested subtask
 * @returns {object} 404 - Subtask not found
 */
router.get('/subtasks/:subtaskId', subtaskController.getSubTask);

/**
 * Route for deleting a subtask by ID.
 *
 * @route DELETE /tasks/:taskId/subtasks/:subtaskId
 * @group Subtasks - Operations related to subtask management
 * @param {string} taskId.path.required - The ID of the parent task.
 * @param {string} subtaskId.path.required - The ID of the subtask to delete.
 * @returns {object} 204 - No content (successful deletion)
 * @returns {object} 404 - Subtask not found
 */
router.delete('/subtasks/:subtaskId', subtaskController.deleteSubTask);

/**
 * Route for creating a new subtask.
 *
 * @route POST /tasks/:taskId/subtasks
 * @group Subtasks - Operations related to subtask management
 * @param {string} taskId.path.required - The ID of the parent task.
 * @param {object} subtask.body.required - The subtask data to create.
 * @returns {object} 201 - The created subtask
 */
router.post('/subtasks', subtaskController.createSubTask);

/**
 * Route for updating an existing subtask by ID.
 *
 * @route PUT /tasks/:taskId/subtasks/:subtaskId
 * @group Subtasks - Operations related to subtask management
 * @param {string} taskId.path.required - The ID of the parent task.
 * @param {string} subtaskId.path.required - The ID of the subtask to update.
 * @param {object} subtask.body.required - The updated subtask data.
 * @returns {object} 200 - The updated subtask
 * @returns {object} 404 - Subtask not found
 */
router.put('/subtasks/:subtaskId', subtaskController.updateSubTaskById);

/**
 * Exports the subtask router.
 *
 * This allows the router to be used in the main Express application.
 */
export default router;