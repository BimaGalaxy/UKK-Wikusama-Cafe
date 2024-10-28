import express from "express";
import { verifyToken } from "../middleware/token.verify.js";
import { MeTransactionQuery, kasirAndManajerOnly, kasirOnly, manajerOnly } from "../middleware/user.middleware.js";
import { addTransaksi, getAllTransaksi, getMeTransaksi, getTransactionByCustName, endTransaksi, updateAddTransaksi, getTransasksiByDate, getTransaksiById } from "../controllers/transaksi.controller.js";
// import { logRequest } from "../middleware/logger.js";

const transaksiRoute = express.Router();
// transaksiRoute.use(logRequest);

transaksiRoute.post("/transaksi", verifyToken, kasirOnly, addTransaksi);

transaksiRoute.get("/transaksi", verifyToken, manajerOnly, getAllTransaksi);
transaksiRoute.get("/transaksi/id/:id_transaksi", verifyToken, kasirAndManajerOnly, getTransaksiById);
transaksiRoute.get("/transaksi/search/:searchQuery", verifyToken, kasirAndManajerOnly, getTransactionByCustName);
transaksiRoute.get("/transaksi/me", verifyToken, MeTransactionQuery, getMeTransaksi);
transaksiRoute.get("/transaksi/date", verifyToken, kasirAndManajerOnly, getTransasksiByDate);

transaksiRoute.patch("/transaksi/add/:id_transaksi", verifyToken, kasirOnly, updateAddTransaksi);
transaksiRoute.patch("/transaksi/end/:id_transaksi", verifyToken, kasirOnly, endTransaksi);

export default transaksiRoute;