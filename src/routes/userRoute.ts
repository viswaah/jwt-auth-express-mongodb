import express, { Router } from "express";
import { activate, signIn, signUp, getMe } from "../controllers/userController";
import { protect } from "../middlewares/auth";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.patch("/activate", activate);
router.get("/getme", protect, getMe);

export default router;
