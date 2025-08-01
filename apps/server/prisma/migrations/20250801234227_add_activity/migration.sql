-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('SELLER_REGISTERED', 'BRAND_CREATED', 'PRODUCT_ADDED');

-- CreateTable
CREATE TABLE "public"."activities" (
    "id" SERIAL NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "entity_name" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);
