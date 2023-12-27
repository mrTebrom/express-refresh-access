import express, { Request, Response, NextFunction } from "express";
import env from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route";
env.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
mongoose.connect("mongodb://localhost:27017").catch((err) => console.log(err));

app.use("/api/user", userRoute);
app.listen(port, () => console.log("start", port));
