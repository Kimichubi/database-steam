/*
  Warnings:

  - You are about to drop the `_categoryTofavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_categoryTolikes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_categoryTofavorites" DROP CONSTRAINT "_categoryTofavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_categoryTofavorites" DROP CONSTRAINT "_categoryTofavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_categoryTolikes" DROP CONSTRAINT "_categoryTolikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_categoryTolikes" DROP CONSTRAINT "_categoryTolikes_B_fkey";

-- AlterTable
ALTER TABLE "favorites" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_categoryTofavorites";

-- DropTable
DROP TABLE "_categoryTolikes";

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
