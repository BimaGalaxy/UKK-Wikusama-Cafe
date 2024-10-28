import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import menuRoute from "./routes/menu.route.js";
import mejaRoute from "./routes/meja.route.js";
import transaksiRoute from "./routes/transaksi.route.js";

dotenv.config();
const app = express()
const port = process.env.PORT;
const prisma = new PrismaClient();

(async () => {
  try {
    // Cek koneksi Prisma
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
})();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(authRoute);
app.use(userRoute);
app.use(menuRoute);
app.use(mejaRoute);
app.use(transaksiRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
});

