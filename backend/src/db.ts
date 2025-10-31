import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "./model/Task";
import { users } from "./model/User";
import  dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "taskuser",
  password: process.env.DB_PASS || "taskpass",
  database: process.env.DB_NAME || "webtaskDB",
  synchronize: true,
  logging: false,
  entities: [Task, users],
});