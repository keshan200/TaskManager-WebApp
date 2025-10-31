import { Router } from "express";
import { login, refreshToken, signUp } from "../controller/auth.controller";

const userRouter =  Router()
userRouter.post("/signup",signUp)
userRouter.post("/login",login)
userRouter.post("/refresh-token",refreshToken)

export default userRouter