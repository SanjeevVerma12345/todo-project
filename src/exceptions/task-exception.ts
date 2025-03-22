import {StatusCodes} from "http-status-codes";
import {BaseException} from "./base-exception";

/**
 * Exception thrown when a task is not found
 * Maps to HTTP 404 Not Found
 */
export class TaskNotFoundException extends BaseException {
  constructor(id: string) {
    super(`Task with ID: ${id} not found`, StatusCodes.NOT_FOUND);
  }
}