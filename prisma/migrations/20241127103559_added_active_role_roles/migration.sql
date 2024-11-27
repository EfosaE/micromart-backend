-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeRole" "UserRole",
ADD COLUMN     "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[];
