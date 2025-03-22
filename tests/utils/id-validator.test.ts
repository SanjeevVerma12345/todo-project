import {IdValidator} from '../../src/utils/id-validator';
import {InvalidIdException} from '../../src/exceptions/base-exception';
import {Types} from 'mongoose';

describe('IdValidator', () => {
  describe('validateObjectId', () => {
    it('should not throw an exception for valid ObjectId', () => {
      // Arrange
      const validId = new Types.ObjectId().toString();

      // Act & Assert
      expect(() => {
        IdValidator.validateObjectId(validId);
      }).not.toThrow();
    });

    it('should not throw an exception for multiple valid ObjectIds', () => {
      // Arrange
      const validId1 = new Types.ObjectId().toString();
      const validId2 = new Types.ObjectId().toString();
      const validId3 = '507f1f77bcf86cd799439011'; // Valid ObjectId in string format

      // Act & Assert
      expect(() => {
        IdValidator.validateObjectId(validId1, validId2, validId3);
      }).not.toThrow();
    });

    it('should throw InvalidIdException for an invalid ObjectId', () => {
      // Arrange
      const invalidId = 'invalid-id';

      // Act & Assert
      expect(() => {
        IdValidator.validateObjectId(invalidId);
      }).toThrow(InvalidIdException);
    });

    it('should throw InvalidIdException with the invalid id in the error message', () => {
      // Arrange
      const invalidId = 'invalid-id';

      // Act & Assert
      expect(() => {
        IdValidator.validateObjectId(invalidId);
      }).toThrow(new InvalidIdException(invalidId));
    });

    it('should throw InvalidIdException for an empty string', () => {
      // Act & Assert
      expect(() => {
        IdValidator.validateObjectId('');
      }).toThrow(InvalidIdException);
    });

    it('should throw InvalidIdException for null', () => {
      // Act & Assert
      expect(() => {
        // @ts-ignore - Testing runtime behavior with invalid input
        IdValidator.validateObjectId(null);
      }).toThrow(InvalidIdException);
    });

    it('should throw InvalidIdException for undefined', () => {
      // Act & Assert
      expect(() => {
        // @ts-ignore - Testing runtime behavior with invalid input
        IdValidator.validateObjectId(undefined);
      }).toThrow(InvalidIdException);
    });

    it('should throw InvalidIdException if any of multiple ids is invalid', () => {
      // Arrange
      const validId1 = new Types.ObjectId().toString();
      const validId2 = new Types.ObjectId().toString();
      const invalidId = 'invalid-id';

      // Act & Assert
      expect(() => {
        IdValidator.validateObjectId(validId1, invalidId, validId2);
      }).toThrow(InvalidIdException);
    });

    it('should throw InvalidIdException with the first invalid id in the error message when multiple ids are invalid', () => {
      // Arrange
      const validId = new Types.ObjectId().toString();
      const invalidId1 = 'invalid-id-1';
      const invalidId2 = 'invalid-id-2';

      // Act & Assert
      expect(() => {
        IdValidator.validateObjectId(validId, invalidId1, invalidId2);
      }).toThrow(new InvalidIdException(invalidId1));
    });
  });
});