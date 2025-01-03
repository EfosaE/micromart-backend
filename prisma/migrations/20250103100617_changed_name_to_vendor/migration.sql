/*
  Warnings:

  - The values [SELLER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `sellerId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Seller` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,vendorId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER', 'VENDOR');
ALTER TABLE "User" ALTER COLUMN "activeRole" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "activeRole" TYPE "UserRole_new" USING ("activeRole"::text::"UserRole_new");
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "UserRole_new"[] USING ("roles"::text::"UserRole_new"[]);
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "activeRole" SET DEFAULT 'USER';
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT ARRAY[]::"UserRole"[];
COMMIT;

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_sellerId_fkey";

-- DropIndex
DROP INDEX "Product_name_sellerId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sellerId",
ADD COLUMN     "vendorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Seller";

-- CreateTable
CREATE TABLE "Vendor" (
    "vendorId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "businessName" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("vendorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorId_categoryId_key" ON "Vendor"("vendorId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_vendorId_key" ON "Product"("name", "vendorId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
