/*
  Warnings:

  - Added the required column `shippingAdressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `shippingAdressId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ShippingAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(200) NOT NULL,
    `street` VARCHAR(200) NOT NULL,
    `zipcode` VARCHAR(200) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShippingAddress` ADD CONSTRAINT `ShippingAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingAdressId_fkey` FOREIGN KEY (`shippingAdressId`) REFERENCES `ShippingAddress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
