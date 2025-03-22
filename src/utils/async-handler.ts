import {NextFunction, Request, Response} from 'express';

type ExpressRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown> | unknown;

export const asyncHandler = (fn: ExpressRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};