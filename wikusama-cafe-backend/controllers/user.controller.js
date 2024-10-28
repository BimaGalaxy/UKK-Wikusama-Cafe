import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const userRole = {
    ADMIN: "admin",
    MANAJER: "manajer",
    KASIR: "kasir"
}

export const getProfile = async (req, res) => {
    const id_user = req.decoded.id_user;
    if (!id_user) return res.sendStatus(401);

    try {
        const user = await prisma.user.findUnique({
            where: {
                id_user: id_user
            },
            select: {
                id_user: true,
                nama_user: true,
                username: true,
                role: true
            }
        });

        if(!user){
            return res.status(404).json({msg: "User not found!"})
        };

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    const {id_user} = req.params;
    const idUserFromParams = parseInt(id_user, 10);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id_user: idUserFromParams,
                AND: req.queryConditions
            },
            select: {
                id_user: true,
                nama_user: true,
                username: true,
                role: true
            }
        });

        if(!user){
            return res.status(404).json({msg: "User not found!"})
        };

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const findUser = async (req, res) => {
    const {searchQuery} = req.params;
    try {
        const users = await prisma.user.findMany({
            where:{
                OR: [
                    {username: {contains: searchQuery}},
                    {nama_user: {contains: searchQuery}}
                ],
                AND: req.queryConditions
            },
            select: {
                id_user: true,
                nama_user: true,
                username: true,
                role: true
            }
        });

        if(!users || users.length === 0){
            return res.status(404).json({
                success: false,
                msg: "User tidak ditemukan!"
            })
        };       
        
        res.status(200).json({
            success: true,
            data: users,
            msg: "Users found"
        });;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: req.queryConditions, 
            select: {
                id_user: true,
                nama_user: true,
                username: true,
                role: true
            },
            orderBy:{
                role: "asc"
            }
        });

        if(!users){
            return res.status(404).json({msg: "No user "})
        };

        res.status(200).json(users);
        
    } catch (error) {
        res.sendStatus(500)
    }
};

export const addUser = async (req, res) => {
    const { nama_user, username, password, confPassword, role } = req.body;

    if(password !== confPassword){
        return res.status(400).json({msg: "Password dan confirm password tidak cocok"});
    };

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if(existingUser){
            return res.status(400).json({msg: "Username sudah terdaftar"});
        };
        
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                nama_user: nama_user,
                username: username,
                password: hashPassword,
                role: role
            }
        });

        res.status(201).json({
            msg: "Register berhasil!",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// untuk update nama, username, dan role 
export const updateUser = async (req, res) => {
    const { id_user } = req.params;
    const { nama_user, username, role, newPassword, confirmNewPassword } = req.body;
    const idUserFromParams = parseInt(id_user, 10);

    try {
        const userToUpdate = await prisma.user.findUnique({
            where: {
                id_user: idUserFromParams
            }
        });

        if(!userToUpdate){
            return res.status(404).json({msg: "User tidak ditemukan"});
        };

        const dataToUpdate = {};
        if (nama_user) dataToUpdate.nama_user = nama_user

        if (username && username !== userToUpdate.username) {
            const existingUsername = await prisma.user.findUnique({
                where: { username }
            });
            if (existingUsername) {
                return res.status(400).json({ msg: "Username sudah terdaftar." });
            }
            dataToUpdate.username = username;
        }

        if (role !== undefined) {
            const validRoles = [userRole.ADMIN, userRole.MANAJER, userRole.KASIR];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ msg: "Role tidak valid" });
            }
            dataToUpdate.role = role;
        }

        if (newPassword) {
            if(newPassword !== confirmNewPassword){
                return res.status(400).json({
                    msg: "Password dan Confirm password tidak cocok"
                });
            };
            const hashPassword = await bcrypt.hash(newPassword, 10);
            dataToUpdate.password = hashPassword;
        }

        await prisma.user.update({
            where: {
                id_user: idUserFromParams
            },
            data: dataToUpdate
        });

        res.status(200).json({msg: "User updated successfully"});
    } catch (error) {
        console.error('Error updating user:', error);
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteUser = async (req, res )=> {
    const { id_user } = req.params;
    const idUserFromParams = parseInt(id_user, 10);
    try {
        const userToDelete = await prisma.user.findUnique({
            where: {
                id_user: idUserFromParams
            }
        });
        
        if(!userToDelete){return res.status(404).json({msg: "User not found"})};

        await prisma.user.delete({
            where: {
                id_user: idUserFromParams
            }
        });

        res.status(200).json({msg: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
        
    }
}
