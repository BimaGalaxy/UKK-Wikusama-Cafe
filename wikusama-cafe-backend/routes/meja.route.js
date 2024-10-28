import express from "express";
import { adminOnly } from "../middleware/user.middleware.js";
import { verifyToken } from "../middleware/token.verify.js";
import { addMeja, deleteMeja, getAllMeja, getMejaById, getMejaByNoMeja, getMejaByStatus, updateMeja } from "../controllers/meja.controller.js";
// import { logRequest } from "../middleware/logger.js";

const mejaRoute = express.Router();
// mejaRoute.use(logRequest);

mejaRoute.get("/meja", verifyToken, getAllMeja);
mejaRoute.get("/meja/nomor/:nomor_meja", verifyToken, getMejaByNoMeja);
mejaRoute.get("/meja/id/:id_meja", verifyToken, getMejaById);
mejaRoute.get("/meja/status/:nomor_meja", verifyToken, getMejaByStatus);

mejaRoute.post("/meja", verifyToken, adminOnly, addMeja);

mejaRoute.patch("/meja/update/:id_meja", verifyToken, adminOnly, updateMeja);

mejaRoute.delete("/meja/delete/:id_meja", verifyToken, adminOnly, deleteMeja);

export default mejaRoute;