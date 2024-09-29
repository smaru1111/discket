/*
  Warnings:

  - You are about to drop the column `user_id` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aad_uid` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_user_id_fkey";

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "user_id",
ADD COLUMN     "aad_uid" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";
