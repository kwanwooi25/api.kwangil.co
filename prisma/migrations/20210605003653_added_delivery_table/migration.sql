-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "method" "DeliveryMethod" NOT NULL,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "memo" VARCHAR(255) DEFAULT E'',
    "productId" INTEGER NOT NULL,
    "workOrderId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_workOrderId_unique" ON "Delivery"("workOrderId");

-- AddForeignKey
ALTER TABLE "Delivery" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
