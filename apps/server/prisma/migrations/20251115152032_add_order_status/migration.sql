-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PROCESSING', 'OUT_FOR_DELIVERY', 'SHIPPED');

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'PROCESSING';
