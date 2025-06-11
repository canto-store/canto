/*
  Warnings:

  - You are about to drop the column `login_from` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "login_from",
DROP COLUMN "name",
ADD COLUMN     "ip_address" TEXT;
