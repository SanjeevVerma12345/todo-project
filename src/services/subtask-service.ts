import {IdValidator} from "../utils/id-validator";
import {SubTaskNotFoundException} from "../exceptions/subtask-expcetion";
import {ISubtask} from "../models/subtask";
import {ISubtaskRepository} from "../interfaces/subtask-repository-interface";

/**
 * Service class for managing subtasks within tasks.
 */
export class SubtaskService {
  /**
   * Constructs a new SubtaskService.
   *
   * @param subtaskRepository The repository used to access and manipulate subtasks.
   */
  constructor(
      private readonly subtaskRepository: ISubtaskRepository
  ) {
  }

  /**
   * Retrieves a subtask by its ID within a specific task.
   *
   * @param taskId The ID of the parent task.
   * @param subtaskId The ID of the subtask to retrieve.
   * @returns A promise that resolves to the retrieved subtask.
   * @throws {InvalidIdException} If the taskid or subtaskid are invalid.
   * @throws {SubTaskNotFoundException} If the specified subtask is not found within the task.
   */
  async getSubTaskById(taskId: string, subtaskId: string): Promise<ISubtask> {
    IdValidator.validateObjectId(taskId, subtaskId);

    const subtask = await this.subtaskRepository.getSubtask(taskId, subtaskId);
    if (!subtask) throw new SubTaskNotFoundException(subtaskId);

    return subtask;
  }

  /**
   * Deletes a subtask by its ID within a specific task.
   *
   * @param taskId The ID of the parent task.
   * @param subtaskId The ID of the subtask to delete.
   * @returns A promise that resolves when the subtask is deleted.
   * @throws {InvalidIdException} If the taskid or subtaskid are invalid.
   * @throws {SubTaskNotFoundException} If the specified subtask is not found within the task.
   */
  async deleteSubTaskById(taskId: string, subtaskId: string): Promise<void> {
    IdValidator.validateObjectId(taskId, subtaskId);

    const subtask = await this.subtaskRepository.getSubtask(taskId, subtaskId);
    if (!subtask) throw new SubTaskNotFoundException(subtaskId);

    const isDeleted = await this.subtaskRepository.deleteSubtask(taskId, subtaskId);
    if (!isDeleted) throw new SubTaskNotFoundException(subtaskId);
  }

  /**
   * Creates a new subtask within a specific task.
   *
   * @param taskId The ID of the parent task.
   * @param subtask The partial subtask object containing the new subtask's data.
   * @returns A promise that resolves to the newly created subtask.
   * @throws {InvalidIdException} If the taskid or subtaskid are invalid.
   * @throws {TaskNotFoundException} If the specified task is not found.
   */
  async createSubTask(taskId: string, subtask: Partial<ISubtask>): Promise<ISubtask> {
    IdValidator.validateObjectId(taskId);

    const newSubtask = await this.subtaskRepository.createSubtask(taskId, subtask);
    if (!newSubtask) throw new SubTaskNotFoundException(taskId);

    return newSubtask;
  }

  /**
   * Updates an existing subtask within a specific task.
   *
   * @param taskId The ID of the parent task.
   * @param subtaskId The ID of the subtask to update.
   * @param subtask The partial subtask object containing the updated subtask data.
   * @returns A promise that resolves to the updated subtask.
   * @throws {InvalidIdException} If the taskid or subtaskid are invalid.
   * @throws {SubTaskNotFoundException} If the specified subtask is not found within the task.
   */
  async updateSubTask(taskId: string, subtaskId: string, subtask: Partial<ISubtask>): Promise<ISubtask> {
    IdValidator.validateObjectId(taskId, subtaskId);

    const updatedSubtask = await this.subtaskRepository.updateSubtask(taskId, subtaskId, subtask);
    if (!updatedSubtask) throw new SubTaskNotFoundException(subtaskId);
    return updatedSubtask;
  }
}