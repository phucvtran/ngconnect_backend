import { Request, Response, NextFunction } from "express";
import { ValidationError } from "sequelize";
import { HttpError } from "../utils/httpError";
/**
 * error handler, http interceptor. handle general error
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.error(err); // Log error for debugging

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error_code: err.statusCode,
      description: err.description,
      message: err.message,
    });
  }

  // Handle Sequelize validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  // Handle other specific errors (like unique constraint errors)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      message: "Duplicate entry",
      errors: err.errors.map((error: any) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  // Handle other specific errors (like unique constraint errors)
  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).json({
      message: "Database SQL Error",
      errors: err.parent,
    });
  }

  //   Handle general errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res
    .status(statusCode)
    .json({ message, ...(err.errors && { errors: err.errors }) });
};
