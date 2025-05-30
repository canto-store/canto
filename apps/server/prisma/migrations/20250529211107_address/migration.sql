-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "office_number" TEXT,
ALTER COLUMN "address_label" DROP NOT NULL;
