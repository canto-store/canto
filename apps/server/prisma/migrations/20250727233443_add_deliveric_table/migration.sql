-- CreateTable
CREATE TABLE "deliveric_orders" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "waybill" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveric_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deliveric_orders_waybill_key" ON "deliveric_orders"("waybill");

-- AddForeignKey
ALTER TABLE "deliveric_orders" ADD CONSTRAINT "deliveric_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
