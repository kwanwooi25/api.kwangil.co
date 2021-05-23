-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PrintSide" AS ENUM ('NONE', 'SINGLE', 'DOUBLE');

-- CreateEnum
CREATE TYPE "PlateMaterial" AS ENUM ('BRASS', 'STEEL');

-- CreateEnum
CREATE TYPE "PlateStatus" AS ENUM ('NEW', 'UPDATE', 'CONFIRM');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('TBD', 'COURIER', 'DIRECT', 'EXPRESS');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('NOT_STARTED', 'EXTRUDING', 'PRINTING', 'CUTTING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "StockHistoryType" AS ENUM ('CREATED', 'MANUFACTURED', 'DELIVERED', 'DISPOSAL', 'STOCKTAKING');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT DEFAULT E'',
    "department" TEXT DEFAULT E'',
    "position" TEXT DEFAULT E'',
    "profileImageUrl" TEXT DEFAULT E'',
    "role" "UserRole" NOT NULL DEFAULT E'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Login" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "crn" TEXT DEFAULT E'',
    "memo" TEXT DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "isBase" BOOLEAN DEFAULT false,
    "title" TEXT NOT NULL,
    "phone" TEXT DEFAULT E'',
    "fax" TEXT DEFAULT E'',
    "email" TEXT DEFAULT E'',
    "address" TEXT DEFAULT E'',
    "memo" TEXT DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "accountId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "thickness" DECIMAL(4,3) NOT NULL,
    "length" DECIMAL(4,1) NOT NULL,
    "width" DECIMAL(4,1) NOT NULL,
    "extColor" TEXT DEFAULT E'투명',
    "extIsAntistatic" BOOLEAN DEFAULT false,
    "extMemo" VARCHAR(255) DEFAULT E'',
    "printSide" "PrintSide" DEFAULT E'NONE',
    "printFrontColorCount" INTEGER DEFAULT 0,
    "printFrontColor" TEXT DEFAULT E'',
    "printFrontPosition" TEXT DEFAULT E'',
    "printBackColorCount" INTEGER DEFAULT 0,
    "printBackColor" TEXT DEFAULT E'',
    "printBackPosition" TEXT DEFAULT E'',
    "printMemo" VARCHAR(255) DEFAULT E'',
    "cutPosition" TEXT DEFAULT E'',
    "cutIsUltrasonic" BOOLEAN DEFAULT false,
    "cutIsForPowder" BOOLEAN DEFAULT false,
    "cutPunchCount" INTEGER DEFAULT 0,
    "cutPunchSize" TEXT DEFAULT E'',
    "cutPunchPosition" TEXT DEFAULT E'',
    "cutMemo" VARCHAR(255) DEFAULT E'',
    "packMaterial" TEXT DEFAULT E'마대',
    "packUnit" INTEGER DEFAULT 0,
    "packCanDeliverAll" BOOLEAN DEFAULT false,
    "packMemo" VARCHAR(255) DEFAULT ''::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "accountId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" SERIAL NOT NULL,
    "type" "StockHistoryType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plate" (
    "id" SERIAL NOT NULL,
    "round" DECIMAL(4,1) NOT NULL,
    "length" DECIMAL(4,1) NOT NULL,
    "name" TEXT DEFAULT E'',
    "material" "PlateMaterial" NOT NULL DEFAULT E'STEEL',
    "location" TEXT DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "memo" VARCHAR(255) DEFAULT E'',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrderSeq" (
    "id" TEXT NOT NULL,
    "seq" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderUpdatedAt" TIMESTAMP(3) NOT NULL,
    "deliverBy" TIMESTAMP(3) NOT NULL,
    "orderQuantity" INTEGER NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "shouldBePunctual" BOOLEAN NOT NULL DEFAULT false,
    "plateStatus" "PlateStatus" NOT NULL DEFAULT E'CONFIRM',
    "isPlateReady" BOOLEAN NOT NULL DEFAULT false,
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT E'TBD',
    "workMemo" VARCHAR(255) DEFAULT E'',
    "deliveryMemo" VARCHAR(255) DEFAULT E'',
    "workOrderStatus" "WorkOrderStatus" NOT NULL DEFAULT E'NOT_STARTED',
    "completedAt" TIMESTAMP(3),
    "completedQuantity" INTEGER,
    "deliveredAt" TIMESTAMP(3),
    "deliveredQuantity" INTEGER,
    "accountId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlateToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Login.userId_unique" ON "Login"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account.name_unique" ON "Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productId_unique" ON "Stock"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "_PlateToProduct_AB_unique" ON "_PlateToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PlateToProduct_B_index" ON "_PlateToProduct"("B");

-- AddForeignKey
ALTER TABLE "Login" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlateToProduct" ADD FOREIGN KEY ("A") REFERENCES "Plate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlateToProduct" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
