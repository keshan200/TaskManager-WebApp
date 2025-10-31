import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../db";
import { users } from "../model/User";
import { APIError } from "../errors/ApiErrors";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(users);

const createAccessToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_SECRET_TOKEN!, { expiresIn: "15m" });
};

const createRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET_TOKEN!, { expiresIn: "3d" });
};





export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
}



export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new APIError(404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new APIError(401, "Invalid credentials");

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      path: "/api/auth/refresh-token",
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};


export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new APIError(401, "Refresh token missing");

    jwt.verify(token, process.env.REFRESH_SECRET_TOKEN!, async (err:any, decoded:any) => {
      if (err) {
        if (err instanceof TokenExpiredError) return next(new APIError(401, "Refresh token expired"));
        if (err instanceof JsonWebTokenError) return next(new APIError(401, "Invalid refresh token"));
        return next(new APIError(401, "Error verifying refresh token"));
      }

      const { userId } = decoded as JwtPayload & { userId: number };
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) return next(new APIError(404, "User not found"));

      const newAccessToken = createAccessToken(user.id);
      res.status(200).json({
        accessToken: newAccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
         
        },
      });
    });
  } catch (err) {
    next(err);
  }
};


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userRepository.find({
      select: ["id", "name", "email"], // exclude password
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};


export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: isProd,
      expires: new Date(0),
      path: "/api/auth/refresh-token",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
}
