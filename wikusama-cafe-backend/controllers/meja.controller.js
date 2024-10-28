import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const statusMeja = {
    DIGUNAKAN: "digunakan",
    SELESAI  : "selesai"
};

const validStatusMeja = [statusMeja.DIGUNAKAN, statusMeja.SELESAI];

const getByNomor = async (nomor_meja) => {
    return await prisma.meja.findUnique({
        where: {
            nomor_meja: nomor_meja
        },
        select: {
            id_meja: true,
            nomor_meja: true,
            status_meja: true,
        }
    });
};

export const getAllMeja = async (req, res) => {
    try {
        const meja = await prisma.meja.findMany({
            select: {
                id_meja: true,
                nomor_meja: true,
                status_meja: true,
            }
        });

        if(!meja)return res.status(404).json({msg: "Meja tidak ditemukan!"});

        res.status(200).json(meja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMejaByNoMeja = async (req, res) => {
    const {nomor_meja} = req.params;
    try {
        const meja = await getByNomor(nomor_meja);

        if(!meja)return res.status(404).json({msg: "Meja tidak ditemukan!"});

        res.status(200).json(meja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMejaById = async (req, res) => {
    const {id_meja} = req.params;
    const intIdMeja = parseInt(id_meja, 10);
    try {
        const meja = await prisma.meja.findUnique({
            where: {
                id_meja: intIdMeja
            }
        })

        if(!meja)return res.status(404).json({msg: "Meja tidak ditemukan!"});

        res.status(200).json({
            success: true,
            data: meja
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getMejaByStatus = async (req, res) => {
    const {status_meja} = req.params;
    try {
        const meja = await prisma.meja.findMany({
            where: {
                status_meja: status_meja
            }
        });

        if(!meja)return res.status(404).json({msg: "Meja tidak ditemukan!"});

        res.status(200).json(meja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMeja = async (req, res) => {
    const {nomor_meja} = req.body; 
    try {
        const existingMeja = await getByNomor(nomor_meja);

        if(existingMeja)return res.status(400).json({msg: "Meja already exists!"});

        const newMeja = await prisma.meja.create({
            data: {
                nomor_meja: nomor_meja,
            },
            select: {
                id_meja: true,
                nomor_meja: true,
                status_meja: true,
            }
        });

        res.status(201).json(newMeja);
    } catch (error) {
        res.status(500).json({ error: error.message });   
    }
};

export const updateMeja = async (req, res) => {
    const {id_meja} = req.params;
    const intIdMeja = parseInt(id_meja, 10);
    const {nomor_meja, status_meja} = req.body;
    try {
        const meja = await prisma.meja.findUnique({
            where: {
                id_meja: intIdMeja
            }
        });

        if(!meja)return res.status(404).json({msg: "Meja tidak ditemukan!"});

        const dataToUpdate = {};
        if (nomor_meja) dataToUpdate.nomor_meja = nomor_meja;
        if (status_meja) dataToUpdate.status_meja = status_meja;    

        await prisma.meja.update({
            where: {
                id_meja: intIdMeja
            },
            data: dataToUpdate,
            select: {
                id_meja: true,
                nomor_meja: true,
                status_meja: true,
            }
        });
        
        res.status(200).json({
            success: true,
            msg: "Meja berhasil diupdate!"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteMeja = async (req, res) => {
        const {id_meja} = req.params;
        const intIdMeja = parseInt(id_meja, 10);

        try {
            const meja = await prisma.meja.findUnique({
                where: {
                    id_meja: intIdMeja
                }
            });

            if(!meja)return res.status(404).json({msg: "Meja tidak ditemukan!"});

            await prisma.meja.delete({
                where: {
                    id_meja: intIdMeja
                }
            });

            res.status(200).json({
                success: true,
                msg: "Meja berhasil dihapus!"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}
