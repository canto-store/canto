-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "return_deadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
