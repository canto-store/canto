-- AlterEnum
ALTER TYPE "public"."ActivityType" ADD VALUE 'PRODUCT_UPDATED';

-- AlterTable
ALTER TABLE "public"."activities" ADD COLUMN     "created_by" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
