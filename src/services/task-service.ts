import {ITask} from "../models/task";
import {TaskNotFoundException} from "../exceptions/task-exception";
import {TaskRepositoryInterface} from "../interfaces/task-repository-interface";
import {IdValidator} from "../utils/id-validator";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepositoryInterface) {
  }

  /**
   * Retrieves all tasks from the repository
   * @returns Promise resolving to an array of tasks
   */
  async getAllTasks(): Promise<ITask[]> {
    return this.taskRepository.findAll();
  }

  /**
   * Retrieves a task by its ID
   * @param id - The task ID
   * @returns Promise resolving to the found task
   * @throws InvalidIdException if ID format is invalid
   * @throws TaskNotFoundException if task doesn't exist
   */
  async getTaskById(id: string): Promise<ITask> {
    IdValidator.validateObjectId(id);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new TaskNotFoundException(id);

    return task;
  }

  /**
   * Deletes a task by its ID
   * @param id - The task ID
   * @throws InvalidIdException if ID format is invalid
   * @throws TaskNotFoundException if task doesn't exist
   */
  async deleteTask(id: string): Promise<void> {
    IdValidator.validateObjectId(id);

    const isDeleted = await this.taskRepository.delete(id);
    if (!isDeleted) throw new TaskNotFoundException(id);
  }

  /**
   * Creates a new task
   * @param taskData - The task data
   * @returns Promise resolving to the created task
   */
  async createTask(taskData: Partial<ITask>): Promise<ITask> {
    return this.taskRepository.create(taskData);
  }

  /**
   * Updates an existing task
   * @param id - The task ID
   * @param taskData - The updated task data
   * @returns Promise resolving to the updated task
   * @throws InvalidIdException if ID format is invalid
   * @throws TaskNotFoundException if task doesn't exist
   */
  async updateTask(id: string, taskData: Partial<ITask>): Promise<ITask | null> {
    IdValidator.validateObjectId(id);

    const updatedTask = await this.taskRepository.update(id, taskData);
    if (!updatedTask) throw new TaskNotFoundException(id);

    return updatedTask;
  }

}