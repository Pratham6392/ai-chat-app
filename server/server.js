import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import connectMongoDB from "./db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT ;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);
app.use("/users", userRoutes);

server.listen(PORT, () => {
    connectMongoDB();
    console.log(`Server Running on port ${PORT}`)
});

