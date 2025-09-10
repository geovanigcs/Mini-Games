-- CreateTable
CREATE TABLE "habilidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "atributo_base" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "personagem_habilidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "maestria" INTEGER NOT NULL DEFAULT 1,
    "experiencia" INTEGER NOT NULL DEFAULT 0,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "personagem_habilidades_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "personagens" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "personagem_habilidades_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "habilidades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_nome_key" ON "habilidades"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "personagem_habilidades_characterId_skillId_key" ON "personagem_habilidades"("characterId", "skillId");
