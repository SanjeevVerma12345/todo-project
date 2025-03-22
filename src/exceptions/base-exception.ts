import {StatusCodes} from "http-status-codes";

/**
 * Base exception class for custom errors
 */
export class BaseException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}


/**
 * Exception thrown when an invalid task ID is provided
 * Maps to HTTP 400 Bad Request
 */
export class InvalidIdException extends BaseException {
  constructor(id: string) {
    super(`Invalid ID: ${id}`, StatusCodes.BAD_REQUEST);
  }
}
