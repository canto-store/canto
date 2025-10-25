/*
  Warnings:

  - A unique constraint covering the columns `[cartId,variantId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_variantId_key" ON "public"."cart_items"("cartId", "variantId");
