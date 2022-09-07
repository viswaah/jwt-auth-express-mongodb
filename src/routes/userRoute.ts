import express, { Router } from "express";
import { activate, signIn, signUp } from "../controllers/userController";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.patch("/activate", activate);

export default router;
