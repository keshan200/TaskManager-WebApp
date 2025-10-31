import { Request, Response, NextFunction } from "express";
import { APIError } from "../errors/ApiErrors";
import { QueryFailedError, EntityNotFoundError } from "typeorm";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Custom APIError
  if (error instanceof APIError) {
    return res.status(error.status).json({ message: error.message });
  }

  // TypeORM entity not found
  if (error instanceof EntityNotFoundError) {
    return res.status(404).json({ message: "Entity not found" });
  }

  // TypeORM query errors (e.g., duplicate key, foreign key constraint)
  if (error instanceof QueryFailedError) {
    return res.status(400).json({ message: error.message });
  }

  // Fallback for other errors
  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Internal Server Error" });
};
