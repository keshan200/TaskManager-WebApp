import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controller/task.controller";
import { getAllUsers } from "../controller/auth.controller";


const taskRouter =  Router()
taskRouter.post("/create",createTask)
taskRouter.get("/get",getTasks)
taskRouter.delete("/delete/:id", deleteTask);
taskRouter.put("/update/:id", updateTask);


export default taskRouter