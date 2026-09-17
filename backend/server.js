import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import apiRouter from './routes/index.js';
import { app, server } from './config/socket.js';

dotenv.config();

const port = process.env.PORT || 3000;

//built-in middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL.split(",").map((origin) => origin.trim()),
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "50mb",
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
}); 

// routes
app.use("/api", apiRouter);

server.listen(port,()=> {
    connectDb();
    console.log(`server started on port ${port}`);
})