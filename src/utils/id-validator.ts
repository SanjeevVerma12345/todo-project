import {InvalidIdException} from "../exceptions/base-exception";
import {Types} from "mongoose";

/**
 * Utility class for validating MongoDB ObjectIds.
 */
export class IdValidator {
  /**
   * Validates one or more MongoDB ObjectId strings.
   *
   * This method checks if each provided string is a valid MongoDB ObjectId.
   * If any of the provided IDs are invalid, it throws an `InvalidIdException`.
   *
   * @param {...string} ids - One or more IDs to validate.
   * @throws {InvalidIdException} If any ID format is invalid.
   *
   * @example
   * IdValidator.validateObjectId("61539e08354c4a30a8449911", "61539e08354c4a30a8449912");
   */
  public static validateObjectId(...ids: string[]): void {
    for (const id of ids) {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new InvalidIdException(id);
      }
    }
  }
}