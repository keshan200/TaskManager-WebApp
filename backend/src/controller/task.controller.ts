import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../db";
import { Task } from "../model/Task";
import { users } from "../model/User";
import { APIError } from "../errors/ApiErrors";


export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
 try {
    const completedQuery = req.query.completed as string | undefined;
    const taskRepository = AppDataSource.getRepository(Task);

    let tasks;

    if (completedQuery === "true" || completedQuery === "false") {
    
      tasks = await taskRepository.find({
        where: { completed: completedQuery === "true" },
        relations: ["user"], 
      });
    } else {
     
      tasks = await taskRepository.find({ relations: ["user"] });
    }

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};


export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, userId } = req.body;

    const taskRepository = AppDataSource.getRepository(Task);
    const userRepository = AppDataSource.getRepository(users);

    const user = await userRepository.findOne({ where: { id: Number(userId) } });
    if (!user) throw new APIError(404, "User not found");

    const newTask = taskRepository.create({
      title,
      description,
      completed: false,
      user,
    });

    await taskRepository.save(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};





export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id);
    const taskRepository = AppDataSource.getRepository(Task);

    const task = await taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new APIError(404, "Task not found");

    await taskRepository.remove(task);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};


export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id);
    const { title, description, completed, userId } = req.body;

    const taskRepository = AppDataSource.getRepository(Task);
    const userRepository = AppDataSource.getRepository(users);


    const task = await taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new APIError(404, "Task not found");

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) throw new APIError(404, "User not found");

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.completed = completed ?? task.completed;
    task.user = user;

    await taskRepository.save(task);

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    next(err);
  }
};
