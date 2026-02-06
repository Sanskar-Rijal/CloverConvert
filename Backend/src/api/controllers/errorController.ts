import type { Request, Response, NextFunction } from "express";
import AppError from "../../utils/AppError.js";

type AnyError = Error & Partial<AppError>;

//Error response for development environment
const sendErrorDev = (err: AnyError, res: Response) => {
  res.status(err.statusCode ?? 500).json({
    status: err.status ?? "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//Error response for production environment
const sendErrorProd = (err: AnyError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode ?? 500).json({
      status: err.status ?? "error",
      message: err.message,
    });
  } else {
    //it is programming error
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      data: "Something went wrong, try again later",
    });
  }
};

//Global Error Handler MiddleWare
export default function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = err as AnyError;
  error.statusCode = error.statusCode ?? 500;
  error.status = error.status ?? "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
}
