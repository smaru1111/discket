/*
  Warnings:

  - You are about to drop the column `aad_uid` on the `coupons` table. All the data in the column will be lost.
  - Added the required column `aadUid` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "aad_uid",
ADD COLUMN     "aadUid" TEXT NOT NULL;
