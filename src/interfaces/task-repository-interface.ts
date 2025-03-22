import {ITask} from "../models/task";

/**
 * Interface defining the contract for a task repository.
 *
 * This interface outlines the methods that a task repository must implement
 * to interact with the underlying data store for task entities.
 */
export interface TaskRepositoryInterface {
  /**
   * Retrieves all tasks from the data store.
   *
   * @returns {Promise<ITask[]>} A promise that resolves to an array of ITask objects.
   */
  findAll(): Promise<ITask[]>;

  /**
   * Retrieves a task from the data store by its ID.
   *
   * @param {string} id The unique identifier of the task to retrieve.
   * @returns {Promise<ITask | null>} A promise that resolves to the ITask object if found, or null if not found.
   */
  findById(id: string): Promise<ITask | null>;

  /**
   * Deletes a task from the data store by its ID.
   *
   * @param {string} id The unique identifier of the task to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the task was successfully deleted, or false if not found.
   */
  delete(id: string): Promise<boolean>;

  /**
   * Creates a new task in the data store.
   *
   * @param {Partial<ITask>} task The partial task data to create the new task from.
   * @returns {Promise<ITask>} A promise that resolves to the created ITask object.
   */
  create(task: Partial<ITask>): Promise<ITask>;

  /**
   * Updates an existing task in the data store by its ID.
   *
   * @param {string} id The unique identifier of the task to update.
   * @param {Partial<ITask>} task The partial task data to update the existing task with.
   * @returns {Promise<ITask | null>} A promise that resolves to the updated ITask object if found, or null if not found.
   */
  update(id: string, task: Partial<ITask>): Promise<ITask | null>;
}