import {SubtaskService} from "../../src/services/subtask-service";
import {ISubtaskRepository} from "../../src/interfaces/subtask-repository-interface";
import {ISubtask} from "../../src/models/subtask";
import {SubTaskNotFoundException} from "../../src/exceptions/subtask-expcetion";
import {IdValidator} from "../../src/utils/id-validator";
import {Types} from "mongoose";

describe('SubtaskService', () => {
  let subtaskService: SubtaskService;
  let mockSubtaskRepository: jest.Mocked<ISubtaskRepository>;

  const mockTaskId = '507f1f77bcf86cd799439011';
  const mockSubtaskId = '507f1f77bcf86cd799439012';

  const mockSubtask = {
    _id: new Types.ObjectId(mockSubtaskId),
    title: 'Test Subtask',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as ISubtask;

  beforeEach(() => {
    mockSubtaskRepository = {
      getSubtask: jest.fn(),
      deleteSubtask: jest.fn(),
      createSubtask: jest.fn(),
      updateSubtask: jest.fn(),
    };

    subtaskService = new SubtaskService(mockSubtaskRepository);

    jest.clearAllMocks();
    jest.spyOn(IdValidator, 'validateObjectId');
  });

  describe('getSubTaskById', () => {
    it('should return a subtask when it exists', async () => {
      mockSubtaskRepository.getSubtask.mockResolvedValue(mockSubtask);

      const result = await subtaskService.getSubTaskById(mockTaskId, mockSubtaskId);

      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.getSubtask).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(result).toEqual(mockSubtask);
    });

    it('should throw SubTaskNotFoundException when subtask does not exist', async () => {
      mockSubtaskRepository.getSubtask.mockResolvedValue(null);

      await expect(subtaskService.getSubTaskById(mockTaskId, mockSubtaskId)).rejects.toThrow(
          SubTaskNotFoundException
      );
      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.getSubtask).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
    });

    it('should throw error when invalid IDs are passed', async () => {
      const invalidTaskId = 'invalid-task-id';
      const invalidSubtaskId = 'invalid-subtask-id';

      await expect(
          subtaskService.getSubTaskById(invalidTaskId, invalidSubtaskId)
      ).rejects.toThrow('Invalid ID: invalid-task-id');

      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(invalidTaskId, invalidSubtaskId);
    });
  });

  describe('deleteSubTaskById', () => {
    it('should delete a subtask when it exists', async () => {
      mockSubtaskRepository.getSubtask.mockResolvedValue(mockSubtask);
      mockSubtaskRepository.deleteSubtask.mockResolvedValue(true);

      await subtaskService.deleteSubTaskById(mockTaskId, mockSubtaskId);

      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.getSubtask).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.deleteSubtask).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
    });

    it('should throw SubTaskNotFoundException when subtask does not exist', async () => {
      mockSubtaskRepository.getSubtask.mockResolvedValue(null);

      await expect(subtaskService.deleteSubTaskById(mockTaskId, mockSubtaskId)).rejects.toThrow(
          SubTaskNotFoundException
      );
      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.getSubtask).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.deleteSubtask).not.toHaveBeenCalled();
    });

    it('should throw SubTaskNotFoundException when delete operation fails', async () => {
      mockSubtaskRepository.getSubtask.mockResolvedValue(mockSubtask);
      mockSubtaskRepository.deleteSubtask.mockResolvedValue(false);

      await expect(subtaskService.deleteSubTaskById(mockTaskId, mockSubtaskId)).rejects.toThrow(
          SubTaskNotFoundException
      );
      expect(mockSubtaskRepository.getSubtask).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.deleteSubtask).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
    });
  });

  describe('createSubTask', () => {
    it('should create a new subtask successfully', async () => {
      const newSubtaskData: Partial<ISubtask> = {
        title: 'New Subtask',
        description: 'New Description',
      };
      const createdSubtask = {
        ...newSubtaskData,
        _id: new Types.ObjectId(mockSubtaskId),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ISubtask;
      mockSubtaskRepository.createSubtask.mockResolvedValue(createdSubtask);

      const result = await subtaskService.createSubTask(mockTaskId, newSubtaskData);

      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId);
      expect(mockSubtaskRepository.createSubtask).toHaveBeenCalledWith(mockTaskId, newSubtaskData);
      expect(result).toEqual(createdSubtask);
    });

    it('should throw Error when creation fails', async () => {
      const newSubtaskData: Partial<ISubtask> = {
        title: 'New Subtask',
        description: 'New Description',
      };
      mockSubtaskRepository.createSubtask.mockResolvedValue(null);

      await expect(subtaskService.createSubTask(mockTaskId, newSubtaskData)).rejects.toThrow(
          `Subtask with ID: ${mockTaskId} not found`
      );
      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId);
      expect(mockSubtaskRepository.createSubtask).toHaveBeenCalledWith(mockTaskId, newSubtaskData);
    });
  });

  describe('updateSubTask', () => {
    it('should update a subtask successfully', async () => {
      const updateData: Partial<ISubtask> = {
        title: 'Updated Title',
        completed: true,
      };

      const updatedSubtask = {
        ...mockSubtask,
        ...updateData,
      } as ISubtask;

      mockSubtaskRepository.updateSubtask.mockResolvedValue(updatedSubtask);

      const result = await subtaskService.updateSubTask(mockTaskId, mockSubtaskId, updateData);

      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.updateSubtask).toHaveBeenCalledWith(
          mockTaskId,
          mockSubtaskId,
          updateData
      );
      expect(result).toEqual(updatedSubtask);
    });

    it('should throw SubTaskNotFoundException when update fails', async () => {
      const updateData: Partial<ISubtask> = {
        title: 'Updated Title',
      };
      mockSubtaskRepository.updateSubtask.mockResolvedValue(null);

      await expect(subtaskService.updateSubTask(mockTaskId, mockSubtaskId, updateData)).rejects.toThrow(
          SubTaskNotFoundException
      );
      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.updateSubtask).toHaveBeenCalledWith(
          mockTaskId,
          mockSubtaskId,
          updateData
      );
    });

    it('should throw SubTaskNotFoundException when subtask not found in updated task', async () => {
      const updateData: Partial<ISubtask> = {
        title: 'Updated Title',
      };

      mockSubtaskRepository.updateSubtask.mockResolvedValue(null);

      await expect(subtaskService.updateSubTask(mockTaskId, mockSubtaskId, updateData)).rejects.toThrow(
          SubTaskNotFoundException
      );
      expect(IdValidator.validateObjectId).toHaveBeenCalledWith(mockTaskId, mockSubtaskId);
      expect(mockSubtaskRepository.updateSubtask).toHaveBeenCalledWith(
          mockTaskId,
          mockSubtaskId,
          updateData
      );
    });
  });
});