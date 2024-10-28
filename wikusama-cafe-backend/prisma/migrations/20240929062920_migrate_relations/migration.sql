-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_meja_fkey` FOREIGN KEY (`id_meja`) REFERENCES `meja`(`id_meja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transaksi` ADD CONSTRAINT `detail_transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transaksi` ADD CONSTRAINT `detail_transaksi_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `menus`(`id_menu`) ON DELETE RESTRICT ON UPDATE CASCADE;
