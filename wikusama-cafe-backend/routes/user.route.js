import express from "express";
import { verifyToken } from "../middleware/token.verify.js";
import { addUser, deleteUser, getAllUsers, getProfile, getUserById, findUser, updateUser } from "../controllers/user.controller.js";
import { adminOnly, authGetUserQuery, authUserParams } from "../middleware/user.middleware.js";
// import { logRequest } from "../middleware/logger.js"; 

const userRoute = express.Router();
// userRoute.use(logRequest);

userRoute.get("/profile", verifyToken, getProfile);
userRoute.get("/users", verifyToken, authGetUserQuery, getAllUsers);
userRoute.get("/users/search/:searchQuery", verifyToken, authGetUserQuery, findUser);
userRoute.get("/users/id/:id_user", verifyToken, authGetUserQuery, getUserById);

userRoute.post("/user/add", verifyToken, adminOnly , addUser);

userRoute.patch("/user/update/:id_user", verifyToken, authUserParams, updateUser)

userRoute.delete("/user/delete/:id_user", verifyToken, adminOnly, deleteUser)

export default userRoute;