/*
  Warnings:

  - Changed the type of `imgType` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ImgType" AS ENUM ('URL', 'FILE');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imgType",
ADD COLUMN     "imgType" "ImgType" NOT NULL;
