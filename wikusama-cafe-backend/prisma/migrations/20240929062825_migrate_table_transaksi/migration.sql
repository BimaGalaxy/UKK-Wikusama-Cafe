-- CreateTable
CREATE TABLE `transaksi` (
    `id_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `tgl_transaksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_user` INTEGER NOT NULL,
    `id_meja` INTEGER NOT NULL,
    `nama_pelanggan` VARCHAR(100) NOT NULL,
    `status_transaksi` ENUM('belum_bayar', 'lunas') NULL,

    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
