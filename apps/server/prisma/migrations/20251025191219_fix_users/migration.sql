/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "email_verified" SET DEFAULT false,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT ARRAY['GUEST']::"public"."UserRole"[];

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "public"."users"("phone_number");
