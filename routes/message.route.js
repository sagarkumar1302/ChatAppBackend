import express from "express";
import { protectedRoute } from "../middleware/auth.protected.js";
import { getMessage, getUserSidebar, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();
router.get("/users", protectedRoute, getUserSidebar);
router.get("/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, sendMessage);
export default router;
