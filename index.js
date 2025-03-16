import express from "express";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server, io } from "./lib/socket.js";
import path from "path"
dotenv.config();
app.use(express.json())
app.use(cookieParser())
const __dirname = path.resolve()
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
const PORT = process.env.PORT;
await connectDB();
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoute);
app.use("/api/message",messageRoute );
// if(process.env.NODE_ENV=== "production"){
//   app.use(express.static(path.join(__dirname, "../frontend/dist")))
//   app.get("*", (req,res)=>{
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   })
// }
server.listen(PORT, () => {
  console.log("Server is running " + PORT);
});
