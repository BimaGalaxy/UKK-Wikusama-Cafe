import express from "express";
import { verifyToken } from "../middleware/token.verify.js";
import { addMenu, deleteMenu, findMenu, getAllMenu, getMenuById, updateMenu } from "../controllers/menu.controller.js";
import { adminOnly } from "../middleware/user.middleware.js";
import upload from "../middleware/multer.config.js";
// import { logRequest } from "../middleware/logger.js";

const menuRoute = express.Router();
// menuRoute.use(logRequest);

menuRoute.get("/menu", verifyToken, getAllMenu)
menuRoute.get("/menu/id/:id_menu", verifyToken, getMenuById)
menuRoute.get("/menu/search/:searchQuery", verifyToken, findMenu)
// menuRoute.get("/menu/jenis/:jenis", verifyToken, getMenuByJenis)

menuRoute.post("/menu", verifyToken, adminOnly, upload.single('gambar') ,addMenu)

menuRoute.patch("/menu/update/:id_menu", verifyToken, adminOnly ,updateMenu)

menuRoute.delete("/menu/delete/:id_menu", verifyToken, adminOnly ,deleteMenu)

export default menuRoute;