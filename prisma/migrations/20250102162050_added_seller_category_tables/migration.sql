-- CreateTable
CREATE TABLE "SellerDetails" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "businessName" TEXT NOT NULL,

    CONSTRAINT "SellerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerDetails_sellerId_key" ON "SellerDetails"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerDetails_sellerId_categoryId_key" ON "SellerDetails"("sellerId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "SellerDetails" ADD CONSTRAINT "SellerDetails_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerDetails" ADD CONSTRAINT "SellerDetails_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
