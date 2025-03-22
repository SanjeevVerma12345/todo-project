import {Response} from "express";
import {StatusCodes} from "http-status-codes";

/**
 * Utility class for building standardized API responses.
 */
export class ResponseBuilder {
  /**
   * Builds and sends an error response.
   *
   * This method constructs a JSON error response with a specified error message and HTTP status code.
   *
   * @param {Response} res - The Express response object.
   * @param {string} errorMessage - The error message to include in the response.
   * @param {number} errorCode - The HTTP status code for the error response.
   * @returns {Response} - The Express response object with the error details.
   *
   * @example
   * ResponseBuilder.errorResponse(res, "Resource not found", StatusCodes.NOT_FOUND);
   */
  public static errorResponse(res: Response, errorMessage: string, errorCode: number): Response {
    return res.status(errorCode).json({error: {errorMessage}});
  }

  /**
   * Builds and sends a successful deletion response (204 No Content).
   *
   * This method sends an empty response with a 204 No Content status code, indicating successful deletion.
   *
   * @param {Response} res - The Express response object.
   * @returns {Response} - The Express response object with the 204 status.
   *
   * @example
   * ResponseBuilder.deletedResponse(res);
   */
  public static deletedResponse(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  /**
   * Builds and sends a successful creation response (201 Created).
   *
   * This method constructs a JSON response with the created data and a 201 Created status code.
   *
   * @param {Response} res - The Express response object.
   * @param {unknown} data - The data to include in the response.
   * @returns {Response} - The Express response object with the created data and 201 status.
   *
   * @example
   * ResponseBuilder.createdResponse(res, { id: "123", name: "New Resource" });
   */
  public static createdResponse(res: Response, data: unknown): Response {
    return res.status(StatusCodes.CREATED).json(data);
  }

  /**
   * Builds and sends a successful response (200 OK).
   *
   * This method constructs a JSON response with the requested data and a 200 OK status code.
   *
   * @param {Response} res - The Express response object.
   * @param {unknown} data - The data to include in the response.
   * @returns {Response} - The Express response object with the requested data and 200 status.
   *
   * @example
   * ResponseBuilder.okResponse(res, { id: "123", name: "Existing Resource" });
   */
  public static okResponse(res: Response, data: unknown): Response {
    return res.status(StatusCodes.OK).json(data);
  }
}