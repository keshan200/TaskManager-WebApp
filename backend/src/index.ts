import express from "express";
import cors from "cors";
import { AppDataSource } from "./db";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser"
import rootRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";



dotenv.config();
const app = express()

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: "GET,PUT,PATCH,DELETE,POST,HEAD",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())



const PORT = process.env.PORT || 3000;



app.use("/api",rootRouter)
app.use(errorHandler)


AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");
    app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error("DB init failed:", err);
  });