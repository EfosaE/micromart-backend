/*
  Warnings:

  - You are about to drop the column `tags` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('GeneralProductTags', 'CategoryBasedTags', 'ConditionBasedTags', 'SeasonalTags', 'PriceBasedTags', 'UsageBasedTags', 'DemographicTags', 'MaterialQualityTags');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tagType" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productToTag" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "productToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_tagType_key" ON "Tag"("name", "tagType");

-- CreateIndex
CREATE INDEX "productToTag_B_index" ON "productToTag"("B");

-- AddForeignKey
ALTER TABLE "productToTag" ADD CONSTRAINT "productToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productToTag" ADD CONSTRAINT "productToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
