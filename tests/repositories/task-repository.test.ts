import mongoose from 'mongoose';
import {TaskRepository} from "../../src/repositories/task-repository";
import Task, {ITask} from "../../src/models/task";

jest.mock('../../src/models/task', () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  exec: jest.fn(),
}));

describe('TaskRepository', () => {
  const taskRepository = new TaskRepository()

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const mockTasks = [{_id: '1', title: 'Task 1'}, {_id: '2', title: 'Task 2'}];
      (Task.find().exec as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskRepository.findAll();

      expect(Task.find).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it('should return empty array', async () => {
      (Task.find().exec as jest.Mock).mockResolvedValue([]);

      const result = await taskRepository.findAll();

      expect(Task.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      const mockTask = {_id: '1', title: 'Task 1'};
      (Task.findById(1).exec as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskRepository.findById('1');

      expect(Task.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      (Task.findById(1).exec as jest.Mock).mockResolvedValue(null);

      const result = await taskRepository.findById('999');

      expect(Task.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a task and return true if successful', async () => {
      const mockTask = {_id: '1', title: 'Task 1'};
      (Task.findByIdAndDelete().exec as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskRepository.delete('1');

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false if task not found', async () => {
      (Task.findByIdAndDelete().exec as jest.Mock).mockResolvedValue(null);

      const result = await taskRepository.delete('999');

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('999');
      expect(result).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData: Partial<ITask> = {title: 'New Task'};
      const mockTask = {_id: '1', ...taskData};
      (Task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskRepository.create(taskData);

      expect(Task.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task and return the updated task', async () => {
      const taskData: Partial<ITask> = {title: 'Updated Task'};
      const mockTask = {_id: '1', ...taskData};
      (Task.findByIdAndUpdate().exec as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskRepository.update('1', taskData);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('1', taskData, {
        new: true,
        runValidators: true,
      });
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      const taskData: Partial<ITask> = {title: 'Updated Task'};
      (Task.findByIdAndUpdate().exec as jest.Mock).mockResolvedValue(null);

      const result = await taskRepository.update('999', taskData);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('999', taskData, {
        new: true,
        runValidators: true,
      });
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle validation errors during creation', async () => {
      const taskData: Partial<ITask> = {title: ''};
      const validationError = new mongoose.Error.ValidationError();
      (Task.create as jest.Mock).mockRejectedValue(validationError);

      await expect(taskRepository.create(taskData)).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should handle database connection errors', async () => {
      const taskData: Partial<ITask> = {title: 'Task'};
      const dbError = new Error('Database connection failed');
      (Task.create as jest.Mock).mockRejectedValue(dbError);

      await expect(taskRepository.create(taskData)).rejects.toThrow('Database connection failed');
    });

    it('should handle invalid ObjectId format', async () => {
      const invalidId = 'not-a-valid-id';
      const castError = new mongoose.Error.CastError('ObjectId', invalidId, 'id');
      (Task.findById(invalidId).exec as jest.Mock).mockRejectedValue(castError);

      await expect(taskRepository.findById(invalidId)).rejects.toThrow(mongoose.Error.CastError);
    });

    it('should handle invalid update data', async () => {
      const invalidData = {createdAt: 'not-a-date'} as any;
      const validationError = new mongoose.Error.ValidationError();
      (Task.findByIdAndUpdate().exec as jest.Mock).mockRejectedValue(validationError);

      await expect(taskRepository.update('1', invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should handle database errors during deletion', async () => {
      const dbError = new Error('Database error during deletion');
      (Task.findByIdAndDelete().exec as jest.Mock).mockRejectedValue(dbError);

      await expect(taskRepository.delete('1')).rejects.toThrow('Database error during deletion');
    });
  });
});