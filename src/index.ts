import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./utils/connectdb";

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const MONGODB_URL: string = process.env.MONGODB_URL || "";

connectDB(MONGODB_URL);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
