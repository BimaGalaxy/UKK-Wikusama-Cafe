-- CreateTable
CREATE TABLE `menus` (
    `id_menu` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_menu` VARCHAR(100) NOT NULL,
    `jenis` ENUM('makanan', 'minuman') NULL,
    `deskripsi` TEXT NOT NULL,
    `gambar` VARCHAR(255) NOT NULL,
    `harga` INTEGER NOT NULL,

    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
