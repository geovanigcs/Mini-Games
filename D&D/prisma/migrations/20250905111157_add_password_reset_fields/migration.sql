/*
  Warnings:

  - You are about to drop the column `reset_expires` on the `usuarios` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reset_token" TEXT,
    "reset_token_expiry" DATETIME,
    "nivel_usuario" INTEGER NOT NULL DEFAULT 1,
    "experiencia_total" INTEGER NOT NULL DEFAULT 0,
    "conquistas" TEXT,
    "preferencias" JSONB,
    "ultimo_login" DATETIME
);
INSERT INTO "new_usuarios" ("conquistas", "createdAt", "email", "experiencia_total", "id", "nickname", "nivel_usuario", "nome", "preferencias", "reset_token", "senha", "ultimo_login", "updatedAt") SELECT "conquistas", "createdAt", "email", "experiencia_total", "id", "nickname", "nivel_usuario", "nome", "preferencias", "reset_token", "senha", "ultimo_login", "updatedAt" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_nickname_key" ON "usuarios"("nickname");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
