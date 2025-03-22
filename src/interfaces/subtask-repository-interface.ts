import {ISubtask} from "../models/subtask";

export interface ISubtaskRepository {

  /**
   * Updates an existing subtask
   */
  updateSubtask(taskId: string, subtaskId: string, subtask: Partial<ISubtask>): Promise<ISubtask | null>;

  /**
   * Deletes a subtask from a task
   */
  deleteSubtask(taskId: string, subtaskId: string): Promise<boolean>;

  /**
   * Gets a subtask by its ID
   */
  getSubtask(taskId: string, subtaskId: string): Promise<ISubtask | null>;

  /**
   * Creates a new subtask
   */
  createSubtask(taskId: string, subtask: Partial<ISubtask>): Promise<ISubtask | null>;
}