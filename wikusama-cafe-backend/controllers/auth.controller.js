import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const register = async (req, res) => {
    const { nama_user, username, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "password dan confirm password tidak cocok"});
    
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (existingUser) return res.status(400).json({ msg: "Username sudah terdaftar." });
        const hashPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                nama_user: nama_user,
                username: username,
                password: hashPassword
            }
        });
        res.json({msg: "Register berhasil"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { reqUsername, reqPassword } = req.body;
    
    if (!reqUsername || !reqPassword) {
        return res.status(400).json({ msg: "Username dan password wajib diisi" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: reqUsername
            }
        });

        if (!user) return res.status(404).json({ msg: "Username tidak terdaftar" });
        const match = await bcrypt.compare(reqPassword, user.password);
        if(!match) return res.status(400).json({msg: "Password salah!"});

        const {id_user, nama_user, username, role} = user;
        const accessToken = jwt.sign({id_user, nama_user, username, role}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: false,  // Set to false in development
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken })
    } catch (error) {
        res.json({error})
        console.log(error);
    }
};

export const logout = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) return res.status(201).json({ message: "Already logged out" });

        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'None',  // Sesuaikan dengan pengaturan CORS jika perlu
        });

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(401).json({ error: error.message });
    }
};

