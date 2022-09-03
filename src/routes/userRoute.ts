import express, { Router } from "express";
import { signIn, signUp } from "../controllers/userController";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);

export default router;
