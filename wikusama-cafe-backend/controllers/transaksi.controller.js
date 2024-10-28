import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

const statusMeja = {
    DIGUNAKAN: "digunakan",
    SELESAI  : "selesai"
};

const statusTransaksi = {
    LUNAS: "lunas",
    BELUM_BAYAR: "belum_bayar"
}

export const addTransaksi = async (req, res) => {
    const {nama_pelanggan, nomor_meja, order_detail} = req.body;

    try {
        const meja = await prisma.meja.findUnique({
            where:{
                nomor_meja: nomor_meja
            }
        });
    
        if(!meja) {
            return res.status(404).json({msg: "Meja tidak ditemukan"});
        };
    
        if(meja.status_meja === statusMeja.DIGUNAKAN) {
            return res.status(400).json({msg: "Meja masih digunakan"});
        }; 

        let totalHarga = 0;

        const transaksi =  await prisma.$transaction(async (prisma) => {  
            const newTransaksi = await prisma.transaksi.create({
                data: {
                    nama_pelanggan: nama_pelanggan,
                    id_user: req.decoded.id_user,
                    id_meja: meja.id_meja,
                    total_harga: 0  
                }
            });

            for (const detail of order_detail) {
                const { id_menu, jumlah } = detail;
                const menu = await prisma.menu.findUnique({
                    where: {
                        id_menu: id_menu
                    }
                });
                if (!menu) {
                    throw new Error(`Menu dengan id ${id_menu} tidak ditemukan`);
                }
                const totalHargaPerMenu = jumlah * menu.harga;
                totalHarga += totalHargaPerMenu;

                await prisma.detailTransaski.create({
                    data: {
                        id_transaksi: newTransaksi.id_transaksi,
                        id_menu: id_menu,
                        jumlah: jumlah,
                        harga: totalHargaPerMenu
                    }
                });                
            };

            await prisma.meja.update({
                where: {
                    nomor_meja: nomor_meja
                },
                data: {
                    status_meja: statusMeja.DIGUNAKAN
                }
            });

            await prisma.transaksi.update({
                where: {
                    id_transaksi: newTransaksi.id_transaksi
                },
                data: {
                    total_harga: totalHarga // Simpan total harga yang telah dihitung
                }
            });

            return newTransaksi;
        });

        const orders = await prisma.transaksi.findUnique({
            where: { id_transaksi: transaksi.id_transaksi },
            include:{
                detail_transaksi: {
                    include: {
                        menu: {
                            select: {
                                nama_menu: true,
                                harga: true
                            }
                        }
                    }
                },
                meja: {
                    select: {
                        nomor_meja: true
                    }
                }
            }
        });

        res.status(201).json({ 
            success: true,
            message: "Transaksi berhasil dibuat", 
            data: orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
};

// Untuk menambah menu jika transaksi belum selesai
export const updateAddTransaksi = async (req, res) => {
    const { id_transaksi } = req.params;
    const intIdTransaksi = parseInt(id_transaksi, 10);
    const { order_detail } = req.body;
    try {
        const existingTransaksi = await prisma.transaksi.findUnique({
            where: {
                id_transaksi: intIdTransaksi
            }
        });

        if (!existingTransaksi) {
            return res.status(404).json({msg: "Transaksi tidak ditemukan"});
        };

        if (existingTransaksi.status_transaksi === statusTransaksi.LUNAS) {
            return res.status(400).json({msg: "Transaksi sudah selesai"});
        };
        
        let totalHarga = existingTransaksi.total_harga;

        const transaksi = await prisma.$transaction(async (prisma) => {

            for (const detail of order_detail) {
                const { id_menu, jumlah } = detail;

                const menu = await prisma.menu.findUnique({
                    where: {
                        id_menu: id_menu
                    }
                });
                if (!menu) {
                    throw new Error(`Menu dengan id ${id_menu} tidak ditemukan`);
                }
                const totalHargaPerMenu = jumlah * menu.harga;
                totalHarga += totalHargaPerMenu;

                await prisma.detailTransaski.create({
                    data: {
                        id_transaksi: intIdTransaksi,
                        id_menu: id_menu,
                        jumlah: jumlah,
                        harga: totalHargaPerMenu
                    }
                });
            };

            await prisma.transaksi.update({
                where: {
                    id_transaksi: intIdTransaksi
                },
                data: {
                    total_harga: totalHarga
                }
            });

            return prisma.detailTransaski.findMany({
                where: {
                    id_transaksi: intIdTransaksi
                },
                include: {
                    menu: {
                        select: {
                            nama_menu: true,
                            harga: true
                        }
                    }
                }
            });
        }); 

        res.status(201).json({
            success: true,
            msg: "Pesanan berhasil ditambahkan",
            transaksi: {
                id_transaksi: intIdTransaksi,
                total_harga: totalHarga,
                order_detail: transaksi
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

export const getAllTransaksi = async (req, res) => {
    try {
        const transaksi = await prisma.transaksi.findMany({
            include:{
                user: {
                    select: {
                        nama_user: true
                    }
                },
                detail_transaksi: {
                    include: {
                        menu: {
                            select: {
                                nama_menu: true,
                                harga: true
                            }
                        }
                    }
                },
                meja: {
                    select: {
                        nomor_meja: true,
                        status_meja: true
                    }
                },
                user: {
                    select: {
                        nama_user: true
                    }
                }
            },
            orderBy: {
                tgl_transaksi: 'desc'
            }
        })

        res.status(200).json({
            success: true,
            data: transaksi
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get transaksi berdasarkan user aktif
export const getMeTransaksi = async (req, res) => {
    try {

        const transaksi = await prisma.transaksi.findMany({
            where: {
                id_user: req.queryConditions.id_user
            },
            include:{
                detail_transaksi: {
                    include: {
                        menu: {
                            select: {
                                nama_menu: true,
                                harga: true
                            }
                        }
                    }
                },
                meja: {
                    select: {
                        nomor_meja: true,
                        status_meja: true
                    }
                },
                user: {
                    select: {
                        nama_user: true
                    }
                }
            },
            orderBy: {
                tgl_transaksi: 'desc'
            }
        })

        res.status(200).json({
            success: true,
            data: transaksi
        });
    } catch (error) {
        res.status(500).json({
             error: error.message,
             id_user: req.queryConditions.id_user
        });
    }
};

export const getTransasksiByDate = async (req, res) => {
    const { date } = req.query; // format expected: 'YYYY-MM-DD'

    try {
        const filterDate = dayjs(date);
        const transaksi = await prisma.transaksi.findMany({
            where:{
                tgl_transaksi:{
                    gte: filterDate.startOf('day').toDate(),
                    lte: filterDate.endOf('day').toDate()
                }
            },
            include:{
                detail_transaksi: {
                    include: {
                        menu: {
                            select: {
                                nama_menu: true,
                                harga: true
                            }
                        }
                    }
                },
                meja: {
                    select: {
                        nomor_meja: true,
                        status_meja: true
                    }
                },
                user: {
                    select: {
                        nama_user: true
                    }
                }
            }
        });

        if (!transaksi) {
            return res.status(404).json({msg: "Transaksi tidak ditemukan"});
        }

        res.status(200).json({
            success: true,
            data: transaksi
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTransactionByCustName = async (req, res) => {
    const { searchQuery } = req.params;
    try {
        const transaksi = await prisma.transaksi.findMany({
            where: {
                OR: [
                    { nama_pelanggan: {contains: searchQuery} },
                    { user: {nama_user: {contains: searchQuery}} }
                ]
            },
            include:{
                user: {
                    select: {
                        nama_user: true
                    }
                },
                detail_transaksi: {
                    include: {
                        menu: {
                            select: {
                                nama_menu: true,
                                harga: true
                            }
                        }
                    }
                },
                meja: {
                    select: {
                        nomor_meja: true,
                        status_meja: true
                    }
                },
                user: {
                    select: {
                        nama_user: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            data: transaksi
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const endTransaksi = async (req, res) => {
    const { id_transaksi } = req.params;
    const intIdTransaksi = parseInt(id_transaksi, 10);
    
    try {
        const existingTransaksi = await prisma.transaksi.findUnique({
            where: {
                id_transaksi: intIdTransaksi
            }
        });
    
        if (!existingTransaksi) return res.status(404).json({msg: "Transaksi tidak ditemukan"});
    
        await prisma.transaksi.update({
            where: {
                id_transaksi: intIdTransaksi
            },
            data: {
                status_transaksi: statusTransaksi.LUNAS
            }
        });

        await prisma.meja.update({
            where: {
                id_meja: existingTransaksi.id_meja
            },
            data: {
                status_meja: statusMeja.SELESAI
            }
        })
    
        res.status(200).json({
            success: true,
            msg: "Transaksi selesai"
        })   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTransaksiById = async (req, res) => {
    const { id_transaksi } = req.params;
    const intIdTransaksi = parseInt(id_transaksi, 10);
    
    try {
         const transaksi = await prisma.transaksi.findUnique({
             where: {
                 id_transaksi: intIdTransaksi
             },
             include: {
                user: {
                    select: {
                        nama_user: true
                    }
                },
                 detail_transaksi: {
                     include: {
                         menu: {
                             select: {
                                 nama_menu: true,
                                 harga: true
                             }
                         }
                     }
                 },
                 meja: {
                     select: {
                         nomor_meja: true,
                         status_meja: true
                     }
                 },
                 user: {
                     select: {
                         nama_user: true
                     }
                 }
             }
        });

        if (!transaksi) return res.status(404).json({msg: "Transaksi tidak ditemukan"});

         res.status(200).json({
            success: true,
            data: transaksi
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}