/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "reset_expires" DATETIME;
ALTER TABLE "usuarios" ADD COLUMN "reset_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nickname_key" ON "usuarios"("nickname");
