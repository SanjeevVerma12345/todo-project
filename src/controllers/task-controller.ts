import {Request, Response} from 'express';
import {asyncHandler} from '../utils/async-handler';
import {TaskService} from "../services/task-service";
import {ResponseBuilder} from "../utils/response-builder";

/**
 * Controller responsible for handling HTTP requests related to tasks.
 * Provides endpoints for CRUD operations on tasks.
 */
export class TaskController {
  /**
   * Creates a new TaskController instance.
   *
   * @param {TaskService} taskService - The service that handles task business logic.
   */
  constructor(private readonly taskService: TaskService) {
  }

  /**
   * Retrieves all tasks from the database.
   *
   * @param {Request} _req - Express request object (unused).
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} JSON response with an array of all tasks.
   *
   * @example
   * // GET /tasks
   */
  getTasks = asyncHandler(async (_req: Request, res: Response) => {
    const tasks = await this.taskService.getAllTasks();
    return ResponseBuilder.okResponse(res, tasks);
  });

  /**
   * Retrieves a specific task by its ID.
   *
   * @param {Request} req - Express request object containing the task ID in params.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} JSON response with the requested task or an error message.
   *
   * @example
   * // GET /tasks/:id
   */
  getTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.taskService.getTaskById(req.params.id);
    return ResponseBuilder.okResponse(res, task);
  });

  /**
   * Deletes a task by its ID.
   *
   * @param {Request} req - Express request object containing the task ID in params.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} Empty response with appropriate status code.
   *
   * @example
   * // DELETE /tasks/:id
   */
  deleteTask = asyncHandler(async (req: Request, res: Response) => {
    await this.taskService.deleteTask(req.params.id);
    return ResponseBuilder.deletedResponse(res);
  });

  /**
   * Creates a new task with the provided data.
   *
   * @param {Request} req - Express request object containing task data in the body.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} JSON response with the created task.
   *
   * @example
   * // POST /tasks
   */
  createTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.taskService.createTask(req.body);
    return ResponseBuilder.createdResponse(res, task);
  });

  /**
   * Updates an existing task with the provided data.
   *
   * @param {Request} req - Express request object containing task ID in params and updated data in body.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} JSON response with the updated task.
   *
   * @example
   * // PUT /tasks/:id
   */
  updateTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.taskService.updateTask(req.params.id, req.body);
    return ResponseBuilder.okResponse(res, task);
  });
}