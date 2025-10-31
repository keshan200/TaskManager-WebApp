import { Router } from "express";
import userRouter from "./user.router";
import taskRouter from "./task.router";


const rootRouter =  Router()
rootRouter.use("/auth",userRouter)
rootRouter.use("/task",taskRouter)


export default rootRouter