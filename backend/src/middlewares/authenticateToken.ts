import { NextFunction, Request, Response } from "express";
import { APIError } from "../errors/ApiErrors";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { AppDataSource } from "../db";
import { users } from "../model/User"; 
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role?: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new APIError(401, "Access Token missing");
    }

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN!, async (error, decoded) => {
      if (error) {
        if (error instanceof TokenExpiredError) {
          return next(new APIError(401, "Access Token Expired"));
        } else if (error instanceof JsonWebTokenError) {
          return next(new APIError(401, "Invalid Access Token"));
        } else {
          return next(new APIError(401, "Error Verifying Access Token"));
        }
      }

      if (!decoded || typeof decoded === "string") {
        return next(new APIError(401, "Access Token Payload Error"));
      }

      const { id, role } = decoded as JwtPayload;

    
      const userRepository = AppDataSource.getRepository(users);
      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        return next(new APIError(401, "User not found"));
      }

      req.user = {
        id: user.id,
      };

      console.log("User info from token and DB:", req.user);

      next();
    });
  } catch (err) {
    next(err);
  }
};
