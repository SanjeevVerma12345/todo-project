import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {BaseException} from '../exceptions/base-exception';
import mongoose from "mongoose";
import {ResponseBuilder} from "../utils/response-builder";

/**
 * Error handler for internal server errors.
 *
 * This middleware handles exceptions, including custom BaseExceptions and Mongoose validation errors.
 * It sends appropriate error responses with relevant status codes and error messages.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const internalServerErrorHandler: ErrorRequestHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
  if (err instanceof BaseException) {
    ResponseBuilder.errorResponse(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errorMessages = Object.values(err.errors)
    .map(error => error.message)
    .join('; ');

    ResponseBuilder.errorResponse(
        res,
        errorMessages,
        StatusCodes.BAD_REQUEST
    );
    return;
  }

  console.error(err);
  ResponseBuilder.errorResponse(
      res,
      'An unexpected error occurred',
      StatusCodes.INTERNAL_SERVER_ERROR
  );
};

/**
 * Error handler for "Not Found" errors.
 *
 * This middleware handles requests for routes that do not exist.
 * It sends a "Not Found" response with a 404 status code and a message indicating the requested route.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const notFoundErrorHandler = (req: Request, res: Response, _next: NextFunction) => {
  ResponseBuilder.errorResponse(
      res,
      `Route not found: ${req.method} ${req.originalUrl}`,
      StatusCodes.NOT_FOUND
  );
};