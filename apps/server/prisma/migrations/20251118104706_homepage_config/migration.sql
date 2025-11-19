-- CreateTable
CREATE TABLE "public"."homepage_sections" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."homepage_products" (
    "id" SERIAL NOT NULL,
    "homepageSectionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "homepage_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_sections_position_key" ON "public"."homepage_sections"("position");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_products_homepageSectionId_productId_key" ON "public"."homepage_products"("homepageSectionId", "productId");

-- AddForeignKey
ALTER TABLE "public"."homepage_products" ADD CONSTRAINT "homepage_products_homepageSectionId_fkey" FOREIGN KEY ("homepageSectionId") REFERENCES "public"."homepage_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."homepage_products" ADD CONSTRAINT "homepage_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
