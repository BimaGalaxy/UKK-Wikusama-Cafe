import express from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
// import { logRequest } from "../middleware/logger.js"; 

const authRoute = express.Router();
// authRoute.use(logRequest);

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.delete("/logout", logout);

export default authRoute;