/*
  Warnings:

  - Added the required column `save_address` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "save_address" BOOLEAN NOT NULL;
