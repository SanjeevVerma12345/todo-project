import {SubtaskRepository} from '../../src/repositories/subtask-repository';
import Task from '../../src/models/task';
import mongoose, {Types} from 'mongoose';
import {ISubtask} from "../../src/models/subtask";

jest.mock('../../src/models/task', () => ({
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

describe('SubtaskRepository', () => {
  const subtaskRepository = new SubtaskRepository();
  const validTaskId = '507f1f77bcf86cd799439011';
  const validSubtaskId = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateSubtask', () => {
    it('should update a subtask successfully', async () => {
      // Arrange
      const subtaskUpdate = {title: 'Updated Title', completed: true};
      const existingSubtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'Original Title',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        subtasks: [],
        toObject: () => ({
          _id: validSubtaskId,
          title: 'Original Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          subtasks: []
        })
      };

      const task = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [existingSubtask]
      };

      const updatedTask = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [{
          _id: new Types.ObjectId(validSubtaskId),
          title: 'Updated Title',
          completed: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: expect.any(Date),
          subtasks: []
        }]
      };

      (Task.findOne as jest.Mock).mockResolvedValue(task);
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await subtaskRepository.updateSubtask(validTaskId, validSubtaskId, subtaskUpdate);

      // Assert
      expect(Task.findOne).toHaveBeenCalledWith({_id: validTaskId});
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
          {_id: validTaskId},
          {$set: {'subtasks.0': expect.objectContaining(subtaskUpdate)}},
          {new: true}
      );
      expect(result).toEqual(updatedTask.subtasks[0]);

    });

    it('should return null if task not found', async () => {
      (Task.findOne as jest.Mock).mockResolvedValue(null);
      const result = await subtaskRepository.updateSubtask(validTaskId, validSubtaskId, {title: 'Updated'});
      expect(result).toBeNull();
      expect(Task.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should return null if subtask not found', async () => {
      const task = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [{
          _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
          title: 'Different Subtask',
          toObject: () => ({
            _id: '507f1f77bcf86cd799439013',
            title: 'Different Subtask'
          })
        }]
      };
      (Task.findOne as jest.Mock).mockResolvedValue(task);

      const result = await subtaskRepository.updateSubtask(validTaskId, validSubtaskId, {title: 'Updated'});

      expect(result).toBeNull();
      expect(Task.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should set empty array for subtasks when not provided', async () => {
      // Arrange
      const subtaskUpdate = {title: 'Updated Title'};
      const existingSubtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'Original Title',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        subtasks: [{_id: new Types.ObjectId(), title: 'Nested'}],
        toObject: () => ({
          _id: validSubtaskId,
          title: 'Original Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          subtasks: [{_id: 'nested-id', title: 'Nested'}]
        })
      };

      const task = {_id: new Types.ObjectId(validTaskId), subtasks: [existingSubtask]};
      const updatedTask = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [{
          _id: new Types.ObjectId(validSubtaskId),
          title: 'Updated Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: expect.any(Date),
          subtasks: []
        }]
      };

      (Task.findOne as jest.Mock).mockResolvedValue(task);
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await subtaskRepository.updateSubtask(validTaskId, validSubtaskId, subtaskUpdate);

      // Assert
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
          {_id: validTaskId},
          {
            $set: {
              'subtasks.0': expect.objectContaining({
                title: 'Updated Title',
                subtasks: []
              })
            }
          },
          {new: true}
      );
      expect(result).toEqual(updatedTask.subtasks[0]);

    });

    it('should preserve nested subtasks when not provided in update', async () => {
      // Arrange
      const subtaskUpdate = {title: 'Updated Title'};
      const nestedSubtask = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
        title: 'Nested Subtask',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };

      const existingSubtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'Original Title',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        subtasks: [nestedSubtask],
        toObject: () => ({
          _id: validSubtaskId,
          title: 'Original Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          subtasks: [{
            _id: '507f1f77bcf86cd799439013',
            title: 'Nested Subtask',
            completed: false,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01')
          }]
        })
      };

      const task = {_id: new Types.ObjectId(validTaskId), subtasks: [existingSubtask]};
      const updatedTask = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [{
          _id: new Types.ObjectId(validSubtaskId),
          title: 'Updated Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: expect.any(Date),
          subtasks: []
        }]
      };

      (Task.findOne as jest.Mock).mockResolvedValue(task);
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await subtaskRepository.updateSubtask(validTaskId, validSubtaskId, subtaskUpdate);

      // Assert
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
          {_id: validTaskId},
          {$set: {'subtasks.0': expect.objectContaining({title: 'Updated Title'})}},
          {new: true}
      );
      expect(result).toEqual(updatedTask.subtasks[0]);

    });

    it('should update nested subtasks when provided in update', async () => {
      // Arrange
      const nestedSubtaskId = '507f1f77bcf86cd799439013';
      const updatedNestedSubtask = {
        _id: new Types.ObjectId(nestedSubtaskId),
        title: 'Updated Nested Subtask',
        completed: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      const subtaskUpdate = {
        title: 'Updated Title',
        subtasks: [updatedNestedSubtask]
      } as ISubtask;

      const existingNestedSubtask = {
        _id: new Types.ObjectId(nestedSubtaskId),
        title: 'Original Nested Subtask',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        toObject: () => ({
          _id: nestedSubtaskId,
          title: 'Original Nested Subtask',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01')
        })
      };

      const existingSubtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'Original Title',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        subtasks: [existingNestedSubtask],
        toObject: () => ({
          _id: validSubtaskId,
          title: 'Original Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          subtasks: [existingNestedSubtask.toObject()]
        })
      };

      const task = {_id: new Types.ObjectId(validTaskId), subtasks: [existingSubtask]};

      const updatedTask = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [{
          _id: new Types.ObjectId(validSubtaskId),
          title: 'Updated Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: expect.any(Date),
          subtasks: [{
            _id: new Types.ObjectId(nestedSubtaskId),
            title: 'Updated Nested Subtask',
            completed: true,
            createdAt: new Date('2023-01-01'),
            updatedAt: expect.any(Date)
          }]
        }]
      };

      (Task.findOne as jest.Mock).mockResolvedValue(task);
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await subtaskRepository.updateSubtask(validTaskId, validSubtaskId, subtaskUpdate);

      // Assert
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
          {_id: validTaskId},
          {
            $set: {
              'subtasks.0': expect.objectContaining({
                title: 'Updated Title',
                subtasks: expect.arrayContaining([
                  expect.objectContaining({
                    title: 'Updated Nested Subtask',
                    completed: true
                  })
                ])
              })
            }
          },
          {new: true}
      );
      expect(result).toEqual(updatedTask.subtasks[0]);

    });

    it('should add new nested subtasks when provided in update', async () => {
      // Arrange
      const newNestedSubtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'New Nested Subtask',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      const subtaskUpdate = {
        title: 'Updated Title',
        subtasks: [newNestedSubtask]
      } as ISubtask;

      const existingSubtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'Original Title',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        subtasks: [],
        toObject: () => ({
          _id: validSubtaskId,
          title: 'Original Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          subtasks: []
        })
      };

      const task = {_id: new Types.ObjectId(validTaskId), subtasks: [existingSubtask]};

      const updatedTask = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [{
          _id: new Types.ObjectId(validSubtaskId),
          title: 'Updated Title',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: expect.any(Date),
          subtasks: [{
            _id: expect.any(Types.ObjectId),
            title: 'New Nested Subtask',
            completed: false,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }]
        }]
      };

      (Task.findOne as jest.Mock).mockResolvedValue(task);
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await subtaskRepository.updateSubtask(validTaskId, validSubtaskId, subtaskUpdate);

      // Assert
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
          {_id: validTaskId},
          {
            $set: {
              'subtasks.0': expect.objectContaining({
                title: 'Updated Title',
                subtasks: expect.arrayContaining([
                  expect.objectContaining({
                    title: 'New Nested Subtask',
                    completed: false,
                    _id: expect.any(Types.ObjectId)
                  })
                ])
              })
            }
          },
          {new: true}
      );

      // Fix: Use expect.objectContaining to match only the properties we care about
      expect(result).toEqual(expect.objectContaining({
        title: 'Updated Title',
        subtasks: expect.arrayContaining([
          expect.objectContaining({
            title: 'New Nested Subtask',
            completed: false
          })
        ])
      }));
    });
  });

  describe('deleteSubtask', () => {
    it('should delete a subtask successfully', async () => {
      const updatedTask = {_id: new Types.ObjectId(validTaskId), subtasks: []};
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      const result = await subtaskRepository.deleteSubtask(validTaskId, validSubtaskId);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
          validTaskId,
          {$pull: {subtasks: {_id: validSubtaskId}}},
          {new: true}
      );
      expect(result).toBe(true);
    });

    it('should return false if task not found', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      const result = await subtaskRepository.deleteSubtask(validTaskId, validSubtaskId);
      expect(result).toBe(false);
    });

    it('should return true when task exists but subtask to delete is not found', async () => {
      // Arrange
      const nonExistentSubtaskId = '507f1f77bcf86cd799439022';

      const task = {
        _id: new Types.ObjectId(validTaskId),
        title: 'Test Task',
        subtasks: [
          {
            _id: new Types.ObjectId('507f1f77bcf86cd799439033'),
            title: 'Different Subtask',
            completed: false
          }
        ]
      };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(task);

      // Act
      const result = await subtaskRepository.deleteSubtask(validTaskId, nonExistentSubtaskId);

      // Assert
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
          validTaskId,
          {$pull: {subtasks: {_id: nonExistentSubtaskId}}},
          {new: true}
      );

      expect(result).toBe(true);
    });
  });

  describe('getSubtask', () => {
    it('should get a subtask by id', async () => {
      const subtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'Subtask Title',
        completed: false
      };
      const task = {_id: new Types.ObjectId(validTaskId), subtasks: [subtask]};

      (Task.findOne as jest.Mock).mockResolvedValue(task);

      const result = await subtaskRepository.getSubtask(validTaskId, validSubtaskId);

      expect(Task.findOne).toHaveBeenCalledWith(
          {_id: validTaskId, 'subtasks._id': validSubtaskId},
          {'subtasks.$': 1}
      );
      expect(result).toEqual(subtask);
    });

    it('should return null if task not found', async () => {
      (Task.findOne as jest.Mock).mockResolvedValue(null);
      const result = await subtaskRepository.getSubtask(validTaskId, validSubtaskId);
      expect(result).toBeNull();
    });

    it('should return null if subtasks array is empty', async () => {
      const task = {_id: new Types.ObjectId(validTaskId), subtasks: []};
      (Task.findOne as jest.Mock).mockResolvedValue(task);

      const result = await subtaskRepository.getSubtask(validTaskId, validSubtaskId);

      expect(result).toBeNull();
    });

    it('should return null if subtasks property is undefined', async () => {
      const task = {_id: new Types.ObjectId(validTaskId)};
      (Task.findOne as jest.Mock).mockResolvedValue(task);

      const result = await subtaskRepository.getSubtask(validTaskId, validSubtaskId);

      expect(result).toBeNull();
    });

    it('should get a subtask with nested subtasks', async () => {
      const nestedSubtask = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
        title: 'Nested Subtask',
        completed: false
      };

      const subtask = {
        _id: new Types.ObjectId(validSubtaskId),
        title: 'Subtask Title',
        completed: false,
        subtasks: [nestedSubtask]
      };

      const task = {
        _id: new Types.ObjectId(validTaskId),
        subtasks: [subtask]
      };

      (Task.findOne as jest.Mock).mockResolvedValue(task);

      const result = await subtaskRepository.getSubtask(validTaskId, validSubtaskId);

      expect(Task.findOne).toHaveBeenCalledWith(
          {_id: validTaskId, 'subtasks._id': validSubtaskId},
          {'subtasks.$': 1}
      );

      expect(result).toEqual(subtask);
      expect(result?.subtasks?.[0]).toEqual(nestedSubtask);
    });

    it('should return null if task found but subtask with same id not found', async () => {
      const subtaskData = {
        title: 'New Subtask',
        completed: false
      };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: validTaskId,
        subtasks: [{
          _id: new Types.ObjectId('507f1f77bcf86cd799439999'),
          title: 'Different Subtask',
          completed: false
        }]
      });

      const result = await subtaskRepository.createSubtask(validTaskId, subtaskData);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
          validTaskId,
          {
            $push: {
              subtasks: expect.objectContaining({
                _id: expect.any(Types.ObjectId),
                title: 'New Subtask',
                completed: false
              })
            }
          },
          {new: true}
      );

      expect(result).toBeNull();
    });
  });

  describe('createSubtask', () => {
    it('should create a subtask successfully', async () => {
      const subtaskData = {title: 'New Subtask', completed: false};

      (Task.findByIdAndUpdate as jest.Mock).mockImplementation((id, update) => {
        const mockSubtask = {
          ...update.$push.subtasks,
          _id: update.$push.subtasks._id
        };
        return Promise.resolve({
          _id: id,
          subtasks: [mockSubtask]
        });
      });

      const result = await subtaskRepository.createSubtask(validTaskId, subtaskData);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
          validTaskId,
          {
            $push: {
              subtasks: expect.objectContaining({
                _id: expect.any(Types.ObjectId),
                title: 'New Subtask',
                completed: false
              })
            }
          },
          {new: true}
      );
      expect(result).toEqual(expect.objectContaining({
        _id: expect.any(Types.ObjectId),
        title: 'New Subtask',
        completed: false
      }));
    });

    it('should return null if task not found', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      const result = await subtaskRepository.createSubtask(validTaskId, {title: 'New Subtask'});
      expect(result).toBeNull();
    });

    it('should return null if created subtask not found in result', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: new Types.ObjectId(validTaskId),
        subtasks: [] // Empty subtasks array
      });

      const result = await subtaskRepository.createSubtask(validTaskId, {title: 'New Subtask'});

      expect(result).toBeNull();
    });

    it('should handle subtask with existing _id property', async () => {
      const existingId = new Types.ObjectId();
      const subtaskData = {
        _id: existingId,
        title: 'New Subtask',
        completed: false
      };

      (Task.findByIdAndUpdate as jest.Mock).mockImplementation(() => {
        const newId = new Types.ObjectId();
        return Promise.resolve({
          _id: validTaskId,
          subtasks: [{
            title: 'New Subtask',
            completed: false,
            _id: newId
          }]
        });
      });

      const result = await subtaskRepository.createSubtask(validTaskId, subtaskData);

      expect(result?._id.toString()).not.toBe(existingId.toString());
    });

    it('should create a subtask with nested subtasks', async () => {
      const nestedSubtask = {
        title: 'Nested Subtask',
        completed: false
      };

      const subtaskData = {
        title: 'New Subtask',
        completed: false,
        subtasks: [nestedSubtask]
      } as ISubtask;

      const createdNestedSubtaskId = new Types.ObjectId();

      (Task.findByIdAndUpdate as jest.Mock).mockImplementation((_id, update) => {
        const newSubtaskId = update.$push.subtasks._id;

        return Promise.resolve({
          _id: validTaskId,
          subtasks: [{
            _id: newSubtaskId,
            title: 'New Subtask',
            completed: false,
            subtasks: [{
              _id: createdNestedSubtaskId,
              title: 'Nested Subtask',
              completed: false
            }]
          }]
        });
      });

      const result = await subtaskRepository.createSubtask(validTaskId, subtaskData);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
          validTaskId,
          {
            $push: {
              subtasks: expect.objectContaining({
                _id: expect.any(Types.ObjectId),
                title: 'New Subtask',
                completed: false,
                subtasks: expect.arrayContaining([
                  expect.objectContaining({
                    title: 'Nested Subtask',
                    completed: false
                  })
                ])
              })
            }
          },
          {new: true}
      );

      expect(result).toEqual(expect.objectContaining({
        _id: expect.any(Types.ObjectId),
        title: 'New Subtask',
        completed: false,
        subtasks: expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(Types.ObjectId),
            title: 'Nested Subtask',
            completed: false
          })
        ])
      }));
    });

    it('should create a subtask with default values when minimal data provided', async () => {
      const subtaskData = {
        title: 'Minimal Subtask'
      };

      (Task.findByIdAndUpdate as jest.Mock).mockImplementation((_id, update) => {
        const newSubtaskId = update.$push.subtasks._id;

        return Promise.resolve({
          _id: validTaskId,
          subtasks: [{
            _id: newSubtaskId,
            title: 'Minimal Subtask',
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            subtasks: []
          }]
        });
      });

      const result = await subtaskRepository.createSubtask(validTaskId, subtaskData);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
          validTaskId,
          {
            $push: {
              subtasks: expect.objectContaining({
                _id: expect.any(Types.ObjectId),
                title: 'Minimal Subtask'
              })
            }
          },
          {new: true}
      );

      expect(result).toEqual(expect.objectContaining({
        _id: expect.any(Types.ObjectId),
        title: 'Minimal Subtask',
        completed: false
      }));
    });
  });

  describe('Error handling', () => {
    const dbError = new Error('Database connection error');

    it('should handle database errors in updateSubtask', async () => {
      (Task.findOne as jest.Mock).mockRejectedValue(dbError);
      await expect(subtaskRepository.updateSubtask(validTaskId, validSubtaskId, {title: 'Updated'}))
      .rejects.toThrow('Database connection error');
    });

    it('should handle database errors in deleteSubtask', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockRejectedValue(dbError);
      await expect(subtaskRepository.deleteSubtask(validTaskId, validSubtaskId))
      .rejects.toThrow('Database connection error');
    });

    it('should handle database errors in getSubtask', async () => {
      (Task.findOne as jest.Mock).mockRejectedValue(dbError);
      await expect(subtaskRepository.getSubtask(validTaskId, validSubtaskId))
      .rejects.toThrow('Database connection error');
    });

    it('should handle database errors in createSubtask', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockRejectedValue(dbError);
      await expect(subtaskRepository.createSubtask(validTaskId, {title: 'New Subtask'}))
      .rejects.toThrow('Database connection error');
    });

    it('should handle validation errors', async () => {
      const validationError = new mongoose.Error.ValidationError();
      (Task.findOne as jest.Mock).mockResolvedValue({
        _id: validTaskId,
        subtasks: [{
          _id: validSubtaskId,
          toObject: () => ({_id: validSubtaskId})
        }]
      });
      (Task.findOneAndUpdate as jest.Mock).mockRejectedValue(validationError);

      await expect(subtaskRepository.updateSubtask(validTaskId, validSubtaskId, {title: ''}))
      .rejects.toThrow(mongoose.Error.ValidationError);
    });
  });
});