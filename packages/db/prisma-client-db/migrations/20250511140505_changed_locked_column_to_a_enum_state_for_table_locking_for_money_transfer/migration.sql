/*
  Warnings:

  - The `locked` column on the `Balance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LockState" AS ENUM ('Unlocked', 'Locked');

-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "locked",
ADD COLUMN     "locked" "LockState" NOT NULL DEFAULT 'Unlocked';
