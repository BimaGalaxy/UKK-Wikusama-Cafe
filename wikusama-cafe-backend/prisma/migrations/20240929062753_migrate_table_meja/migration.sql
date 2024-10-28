-- CreateTable
CREATE TABLE `meja` (
    `id_meja` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_meja` VARCHAR(100) NOT NULL,
    `status_meja` ENUM('digunakan', 'selesai') NULL,

    PRIMARY KEY (`id_meja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
