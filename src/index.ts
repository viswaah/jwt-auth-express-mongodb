import express, { Express } from "express";
import userRoute from "./routes/userRoute";
import "dotenv/config";
import connectDB from "./utils/connectdb";

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const MONGODB_URL: string = process.env.MONGODB_URL || "";

connectDB(MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
