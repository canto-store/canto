-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'REJECTED';

-- CreateTable
CREATE TABLE "product_rejections" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_rejections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_rejections_productId_key" ON "product_rejections"("productId");

-- AddForeignKey
ALTER TABLE "product_rejections" ADD CONSTRAINT "product_rejections_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
