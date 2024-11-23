-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;
