-- Add new string columns
ALTER TABLE "public"."order_items" ADD COLUMN "delivery_status_new" TEXT;
ALTER TABLE "public"."orders" ADD COLUMN "delivery_status_new" TEXT;

-- Copy enum values as strings (NOT_DELIVERED_YET and DELIVERED will become strings)
UPDATE "public"."order_items" SET "delivery_status_new" = "delivery_status"::TEXT;
UPDATE "public"."orders" SET "delivery_status_new" = "delivery_status"::TEXT;

-- Make new columns NOT NULL (since original was required)
ALTER TABLE "public"."order_items" ALTER COLUMN "delivery_status_new" SET NOT NULL;
ALTER TABLE "public"."orders" ALTER COLUMN "delivery_status_new" SET NOT NULL;

-- Drop old enum columns
ALTER TABLE "public"."order_items" DROP COLUMN "delivery_status";
ALTER TABLE "public"."orders" DROP COLUMN "delivery_status";

-- Rename new columns
ALTER TABLE "public"."order_items" RENAME COLUMN "delivery_status_new" TO "delivery_status";
ALTER TABLE "public"."orders" RENAME COLUMN "delivery_status_new" TO "delivery_status";

-- Drop the DeliveryStatus enum type
DROP TYPE "public"."DeliveryStatus";