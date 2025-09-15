-- CreateTable
CREATE TABLE "public"."_OrderItemToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderItemToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderItemToUser_B_index" ON "public"."_OrderItemToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."_OrderItemToUser" ADD CONSTRAINT "_OrderItemToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrderItemToUser" ADD CONSTRAINT "_OrderItemToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
