import {BaseException} from "./base-exception";
import {StatusCodes} from "http-status-codes";

/**
 * Exception thrown when a subtask is not found
 * Maps to HTTP 404 Not Found
 */
export class SubTaskNotFoundException extends BaseException {
  constructor(id: string) {
    super(`Subtask with ID: ${id} not found`, StatusCodes.NOT_FOUND);
  }
}