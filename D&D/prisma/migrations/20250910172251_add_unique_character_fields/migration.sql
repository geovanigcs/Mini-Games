/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `personagens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[titulo]` on the table `personagens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pseudonimo]` on the table `personagens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "personagens" ADD COLUMN "pseudonimo" TEXT;
ALTER TABLE "personagens" ADD COLUMN "titulo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "personagens_nome_key" ON "personagens"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "personagens_titulo_key" ON "personagens"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "personagens_pseudonimo_key" ON "personagens"("pseudonimo");
