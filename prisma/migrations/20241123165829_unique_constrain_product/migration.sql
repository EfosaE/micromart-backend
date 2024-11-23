/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_name_userId_key" ON "Product"("name", "userId");
