/*
  Warnings:

  - You are about to drop the `SellerDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SellerDetails" DROP CONSTRAINT "SellerDetails_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "SellerDetails" DROP CONSTRAINT "SellerDetails_sellerId_fkey";

-- DropTable
DROP TABLE "SellerDetails";

-- CreateTable
CREATE TABLE "Seller" (
    "sellerId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "businessName" TEXT NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("sellerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_sellerId_categoryId_key" ON "Seller"("sellerId", "categoryId");

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
