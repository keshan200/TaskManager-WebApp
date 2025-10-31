import express from "express";
import cors from "cors";
import { AppDataSource } from "./db";

import * as dotenv from "dotenv";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");
    app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error("DB init failed:", err);
  });