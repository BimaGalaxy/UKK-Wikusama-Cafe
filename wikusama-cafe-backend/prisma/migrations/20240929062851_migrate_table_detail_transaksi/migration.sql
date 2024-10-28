-- CreateTable
CREATE TABLE `detail_transaksi` (
    `id_detail_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL,
    `id_menu` INTEGER NOT NULL,
    `harga` INTEGER NOT NULL,

    PRIMARY KEY (`id_detail_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
