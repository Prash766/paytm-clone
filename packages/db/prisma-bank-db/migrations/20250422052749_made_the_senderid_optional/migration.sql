-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_senderId_fkey";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "senderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
