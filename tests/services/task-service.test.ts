import {TaskService} from '../../src/services/task-service';
import {TaskRepositoryInterface} from '../../src/interfaces/task-repository-interface';
import {ITask} from '../../src/models/task';
import {TaskNotFoundException} from '../../src/exceptions/task-exception';
import {InvalidIdException} from '../../src/exceptions/base-exception';
import {Types} from 'mongoose';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepositoryInterface>;

  const validTaskId = '507f1f77bcf86cd799439011';
  const invalidTaskId = 'invalid-id';

  const mockTask = {
    _id: new Types.ObjectId(validTaskId),
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
  } as ITask;

  beforeEach(() => {
    mockTaskRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    taskService = new TaskService(mockTaskRepository);
  });

  describe('getAllTasks', () => {
    it('should return all tasks from the repository', async () => {
      // Arrange
      const mockTasks: ITask[] = [
        mockTask as ITask,
        {
          ...mockTask,
          _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
          title: 'Another Task',
        } as ITask,
      ];
      mockTaskRepository.findAll.mockResolvedValue(mockTasks);

      // Act
      const result = await taskService.getAllTasks();

      // Assert
      expect(mockTaskRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTasks);
    });

    it('should return an empty array when no tasks exist', async () => {
      // Arrange
      mockTaskRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await taskService.getAllTasks();

      // Assert
      expect(mockTaskRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task when valid ID is provided', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.getTaskById(validTaskId);

      // Assert
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(validTaskId);
      expect(result).toEqual(mockTask);
    });

    it('should throw TaskNotFoundException when task does not exist', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskService.getTaskById(validTaskId)).rejects.toThrow(TaskNotFoundException);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(validTaskId);
    });

    it('should throw InvalidIdException when invalid ID format is provided', async () => {
      // Act & Assert
      await expect(taskService.getTaskById(invalidTaskId)).rejects.toThrow(InvalidIdException);
      expect(mockTaskRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task when valid ID is provided', async () => {
      // Arrange
      mockTaskRepository.delete.mockResolvedValue(true);

      // Act
      await taskService.deleteTask(validTaskId);

      // Assert
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(validTaskId);
    });

    it('should throw TaskNotFoundException when task does not exist', async () => {
      // Arrange
      mockTaskRepository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(taskService.deleteTask(validTaskId)).rejects.toThrow(TaskNotFoundException);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(validTaskId);
    });

    it('should throw InvalidIdException when invalid ID format is provided', async () => {
      // Act & Assert
      await expect(taskService.deleteTask(invalidTaskId)).rejects.toThrow(InvalidIdException);
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      // Arrange
      const taskData: Partial<ITask> = {
        title: 'New Task',
        description: 'New Description',
      };

      mockTaskRepository.create.mockResolvedValue({
        ...taskData,
        _id: new Types.ObjectId(validTaskId),
        completed: false,
        subtasks: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as ITask);

      // Act
      const result = await taskService.createTask(taskData);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(
          expect.objectContaining({
            ...taskData,
            _id: expect.any(Types.ObjectId),
          })
      );
    });
  });

  describe('updateTask', () => {
    it('should update and return a task when valid ID is provided', async () => {
      // Arrange
      const taskUpdate: Partial<ITask> = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const updatedTask = {
        ...mockTask,
        ...taskUpdate,
        updatedAt: new Date(),
      } as ITask;

      mockTaskRepository.update.mockResolvedValue(updatedTask);

      // Act
      const result = await taskService.updateTask(validTaskId, taskUpdate);

      // Assert
      expect(mockTaskRepository.update).toHaveBeenCalledWith(validTaskId, taskUpdate);
      expect(result).toEqual(updatedTask);
    });

    it('should throw TaskNotFoundException when task does not exist', async () => {
      // Arrange
      const taskUpdate: Partial<ITask> = {title: 'Updated Title'};
      mockTaskRepository.update.mockResolvedValue(null);

      // Act & Assert
      await expect(taskService.updateTask(validTaskId, taskUpdate)).rejects.toThrow(TaskNotFoundException);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(validTaskId, taskUpdate);
    });

    it('should throw InvalidIdException when invalid ID format is provided', async () => {
      // Arrange
      const taskUpdate: Partial<ITask> = {title: 'Updated Title'};

      // Act & Assert
      await expect(taskService.updateTask(invalidTaskId, taskUpdate)).rejects.toThrow(InvalidIdException);
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });
  });
});