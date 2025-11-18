-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "return_deadline" DROP NOT NULL,
ALTER COLUMN "return_deadline" DROP DEFAULT;
