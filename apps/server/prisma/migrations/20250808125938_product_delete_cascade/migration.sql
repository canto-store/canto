-- DropForeignKey
ALTER TABLE "public"."product_rejections" DROP CONSTRAINT "product_rejections_productId_fkey";

-- AddForeignKey
ALTER TABLE "public"."product_rejections" ADD CONSTRAINT "product_rejections_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
