/*
  Warnings:

  - You are about to drop the column `ip_address` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."error_logs" DROP CONSTRAINT "error_logs_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."error_logs" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "ip_address";

-- AddForeignKey
ALTER TABLE "public"."error_logs" ADD CONSTRAINT "error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
