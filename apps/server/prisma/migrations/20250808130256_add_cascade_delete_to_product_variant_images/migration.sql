-- DropForeignKey
ALTER TABLE "public"."product_variant_images" DROP CONSTRAINT "product_variant_images_variantId_fkey";

-- AddForeignKey
ALTER TABLE "public"."product_variant_images" ADD CONSTRAINT "product_variant_images_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
