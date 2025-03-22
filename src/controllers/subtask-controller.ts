import {Request, Response} from 'express';
import {asyncHandler} from '../utils/async-handler';
import {SubtaskService} from "../services/subtask-service";
import {ResponseBuilder} from "../utils/response-builder";

/**
 * Controller for handling subtask-related API endpoints.
 */
export class SubtaskController {
  /**
   * Constructs a new SubtaskController.
   *
   * @param {SubtaskService} subtaskService - The service responsible for subtask operations.
   */
  constructor(private readonly subtaskService: SubtaskService) {
  }

  /**
   * Retrieves a subtask by its ID within a specific task.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - A promise that resolves to the Express response.
   *
   * @example
   * // GET /tasks/:id/subtasks/:subtaskId
   */
  getSubTask = asyncHandler(async (req: Request, res: Response) => {
    const subtask = await this.subtaskService.getSubTaskById(req.params.id, req.params.subtaskId);
    return ResponseBuilder.okResponse(res, subtask);
  });

  /**
   * Deletes a subtask by its ID within a specific task.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - A promise that resolves to the Express response.
   *
   * @example
   * // DELETE /tasks/:id/subtasks/:subtaskId
   */
  deleteSubTask = asyncHandler(async (req: Request, res: Response) => {
    await this.subtaskService.deleteSubTaskById(req.params.id, req.params.subtaskId);
    return ResponseBuilder.deletedResponse(res);
  });

  /**
   * Creates a new subtask within a specific task.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - A promise that resolves to the Express response.
   *
   * @example
   * // POST /tasks/:id/subtasks
   */
  createSubTask = asyncHandler(async (req: Request, res: Response) => {
    const subtask = await this.subtaskService.createSubTask(req.params.id, req.body);
    return ResponseBuilder.createdResponse(res, subtask);
  });

  /**
   * Updates an existing subtask within a specific task.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - A promise that resolves to the Express response.
   *
   * @example
   * // PUT /tasks/:id/subtasks/:subtaskId
   */
  updateSubTaskById = asyncHandler(async (req: Request, res: Response) => {
    const subtask = await this.subtaskService.updateSubTask(req.params.id, req.params.subtaskId, req.body);
    return ResponseBuilder.okResponse(res, subtask);
  });
}