-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nivel_usuario" INTEGER NOT NULL DEFAULT 1,
    "experiencia_total" INTEGER NOT NULL DEFAULT 0,
    "conquistas" TEXT,
    "preferencias" JSONB,
    "ultimo_login" DATETIME
);

-- CreateTable
CREATE TABLE "personagens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "raca" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "forca" INTEGER NOT NULL,
    "destreza" INTEGER NOT NULL,
    "constituicao" INTEGER NOT NULL,
    "inteligencia" INTEGER NOT NULL,
    "sabedoria" INTEGER NOT NULL,
    "carisma" INTEGER NOT NULL,
    "idade" INTEGER NOT NULL,
    "altura" INTEGER NOT NULL,
    "peso" INTEGER NOT NULL,
    "corOlhos" TEXT NOT NULL,
    "corCabelo" TEXT NOT NULL,
    "corPele" TEXT NOT NULL,
    "estilo" TEXT NOT NULL,
    "alinhamento" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "motivacao" TEXT NOT NULL,
    "traumas" TEXT NOT NULL,
    "inimigos" TEXT NOT NULL,
    "segredo" TEXT NOT NULL,
    "armas" TEXT NOT NULL,
    "armadura" TEXT NOT NULL,
    "itensEspeciais" TEXT NOT NULL,
    "proficiencias" TEXT NOT NULL,
    "magias" TEXT NOT NULL,
    "poderes" TEXT NOT NULL,
    "idiomas" TEXT NOT NULL,
    "conhecimentos" TEXT NOT NULL,
    "personalidade" TEXT NOT NULL,
    "tracos" TEXT NOT NULL,
    "ideais" TEXT NOT NULL,
    "vinculos" TEXT NOT NULL,
    "defeitos" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "experiencia" INTEGER NOT NULL DEFAULT 0,
    "pontos_vida_atuais" INTEGER NOT NULL DEFAULT 0,
    "pontos_vida_maximos" INTEGER NOT NULL DEFAULT 0,
    "dinheiro_cobre" INTEGER NOT NULL DEFAULT 0,
    "dinheiro_prata" INTEGER NOT NULL DEFAULT 0,
    "dinheiro_ouro" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "personagens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "racas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "habilidades_especiais" TEXT NOT NULL,
    "altura_media_cm" INTEGER NOT NULL,
    "peso_medio_kg" INTEGER NOT NULL,
    "expectativa_vida" INTEGER NOT NULL,
    "bonus_forca" INTEGER NOT NULL DEFAULT 0,
    "bonus_destreza" INTEGER NOT NULL DEFAULT 0,
    "bonus_constituicao" INTEGER NOT NULL DEFAULT 0,
    "bonus_inteligencia" INTEGER NOT NULL DEFAULT 0,
    "bonus_sabedoria" INTEGER NOT NULL DEFAULT 0,
    "bonus_carisma" INTEGER NOT NULL DEFAULT 0,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "classes_personagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "icone_nome" TEXT NOT NULL,
    "atributo_principal" TEXT NOT NULL,
    "dado_vida" INTEGER NOT NULL,
    "habilidades_iniciais" TEXT NOT NULL,
    "tipo_armadura" TEXT,
    "armas_permitidas" TEXT,
    "escolas_magia" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
