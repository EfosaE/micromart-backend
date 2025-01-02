/*
  Warnings:

  - Changed the type of `tagType` on the `Tag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "TagType" ADD VALUE 'Others';

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagType",
ADD COLUMN     "tagType" "TagType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_tagType_key" ON "Tag"("name", "tagType");
