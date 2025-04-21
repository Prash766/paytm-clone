/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signature` to the `OnRampTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnRampTransaction" ADD COLUMN     "signature" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_signature_key" ON "OnRampTransaction"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_userId_key" ON "OnRampTransaction"("userId");
