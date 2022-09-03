import { Request, Response, NextFunction } from "express";
import "dotenv/config";

const NODE_ENV = process.env.NODE_ENV;

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: err.message,
    stack: NODE_ENV === "development" ? err.stack : "",
  });
  next(err);
};
