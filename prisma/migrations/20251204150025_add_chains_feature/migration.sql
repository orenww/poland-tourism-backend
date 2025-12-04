-- AlterTable
ALTER TABLE "SubItem" ADD COLUMN     "chainId" INTEGER;

-- CreateTable
CREATE TABLE "Chain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "benefit" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_name_key" ON "Chain"("name");

-- AddForeignKey
ALTER TABLE "SubItem" ADD CONSTRAINT "SubItem_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
