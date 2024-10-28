import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from 'url';    
import path from "path";
import fs from "fs";
const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const Jenis = {
    MAKANAN: "makanan",
    MINUMAN: "minuman"
}

const validJenis = [Jenis.MAKANAN, Jenis.MINUMAN];

export const getAllMenu = async (req, res) => {
    try {
        const menu = await prisma.menu.findMany({
            select: {
                id_menu: true,
                nama_menu: true,
                jenis: true,
                deskripsi: true,
                gambar: true,
                harga: true,
                url_gambar: true
            }
        })
        if(!menu)return res.status(404).json({msg: "Menu not found!"});
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMenuById = async (req, res) => {
    const { id_menu } = req.params;
    const idMenuFromParams = parseInt(id_menu);
    try {
        const menu = await prisma.menu.findUnique({
            where: {
                id_menu: idMenuFromParams
            },
            select: {
                id_menu: true,
                nama_menu: true,
                jenis: true,
                deskripsi: true,
                gambar: true,
                harga: true,
            }
        });

        if(!menu){
            return res.status(404).json({msg: "Menu not found!"})
        };

        res.status(200).json({
            success: true,
            data: menu
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const findMenu = async (req, res) => {
    const { searchQuery } = req.params;
    try {  
        const menu = await prisma.menu.findMany({
            where: {
                OR: [
                    { nama_menu: {contains: searchQuery} },
                    { jenis: validJenis.includes(searchQuery) ? searchQuery : undefined }
                ]
            }
        });

        if(!menu || menu.length === 0){
            return res.status(404).json({msg: "Menu tidak ditemukan"})
        };

        res.status(200).json({
            success: true,
            data: menu
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// export const getMenuByJenis = async (req, res) => {
//     const { jenis } = req.params;
//     try {
//         const menu = await prisma.menu.findMany({
//             where: {
//                 jenis: jenis
//             }
//         });

//          if(!menu || menu.length === 0){
//             return res.status(404).json({msg: "Menu tidak ditemukan"})
//         };

//          res.status(200).json({
//             success: true,
//             data: menu
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// } 

export const addMenu = async (req, res) => {
    const { nama_menu, jenis, deskripsi, harga } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const url_gambar = gambar ? `${req.protocol}://${req.get('host')}/images/${gambar}` : null;
    const hargaInt = parseInt(harga, 10);

    if (!nama_menu || !jenis || !deskripsi || !gambar || !harga) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
        }
        return res.status(400).json({ msg: "All fields are required!" });
    }

    if (isNaN(hargaInt)) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
        }
        return res.status(400).json({ msg: "Invalid price format!" });
    }

    try {
        const existingMenu = await prisma.menu.findFirst({
            where: {
                nama_menu: nama_menu
            }
        });

        if (existingMenu) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
            }
            return res.status(400).json({ msg: "Menu already exists!" });
        }

        if (!validJenis.includes(jenis)) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
            }
            return res.status(400).json({ msg: "Invalid jenis!" });
        }

        const newMenu = await prisma.menu.create({
            data: {
                nama_menu: nama_menu,
                jenis: jenis,
                deskripsi: deskripsi,
                gambar: gambar,
                url_gambar: url_gambar,
                harga: hargaInt
            }
        });

        res.status(201).json({
            success: true,
            data: newMenu
        });
    } catch (error) {
        if (req.file) {
            fs.unlink(path.join(__dirname, '../uploads', req.file.filename), (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        res.status(500).json({ error: error.message });
    }
};


export const updateMenu = async (req, res) => {
    const {id_menu} = req.params;
    const { nama_menu, jenis, deskripsi, harga } = req.body;
    const idMenuFromParams = parseInt(id_menu);
    const hargaInt = harga ? parseInt(harga, 10) : undefined;
    
    try {
        const menuToUpdate = await prisma.menu.findUnique({
            where: {
                id_menu: idMenuFromParams
            }
        });
        
        if(!menuToUpdate)return res.status(404).json({msg: "Menu not found!"});

        const dataToUpdate = {};
        if (nama_menu) dataToUpdate.nama_menu = nama_menu;
        if (jenis) dataToUpdate.jenis = jenis;
        if (deskripsi) dataToUpdate.deskripsi = deskripsi;
        if (hargaInt !== undefined) dataToUpdate.harga = hargaInt;

        const updatedMenu = await prisma.menu.update({
            where: {
                id_menu: idMenuFromParams
            },
            data: dataToUpdate
        });

        res.status(200).json({
            success: true,
            msg: "Menu updated successfully!",
            data: updatedMenu
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteMenu = async (req, res) => {
    const {id_menu} = req.params;
    const idMenuFromParams = parseInt(id_menu);
    try {
        const menuToDelete = await prisma.menu.findUnique({
            where: {
                id_menu: idMenuFromParams
            }
        });

        if(!menuToDelete)return res.status(404).json({msg: "Menu not found!"});

        fs.unlinkSync(path.join(__dirname, '../public/images', menuToDelete.gambar)); 

        await prisma.menu.delete({
            where: {
                id_menu: idMenuFromParams
            }
        });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



