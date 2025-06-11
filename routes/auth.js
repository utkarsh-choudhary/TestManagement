import express from "express";
import { login, logout, signup } from "../controllers/auth.js";

const router = express.Router();

// Login route
router.post("/login", login);

router.post('/logout', logout);

router.post('/signup', signup);

export default router; 