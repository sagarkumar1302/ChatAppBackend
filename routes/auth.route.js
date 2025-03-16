import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.control.js";
import { protectedRoute } from "../middleware/auth.protected.js";

const router = express.Router();
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfile );
router.get("/check", protectedRoute, checkAuth );
export default router;
