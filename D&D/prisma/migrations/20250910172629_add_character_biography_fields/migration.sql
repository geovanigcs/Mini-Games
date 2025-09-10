-- DropIndex
DROP INDEX "personagens_pseudonimo_key";

-- DropIndex
DROP INDEX "personagens_titulo_key";

-- DropIndex
DROP INDEX "personagens_nome_key";

-- AlterTable
ALTER TABLE "personagens" ADD COLUMN "familia" TEXT;
