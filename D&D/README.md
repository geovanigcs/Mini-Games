# 🏰 D&D RPG - Terra Média dos Pirangueiros

Um RPG online completo desenvolvido com Next.js, Prisma e Docker, baseado no universo de D&D com toques brasileiros únicos.

## 🚀 Funcionalidades

- ✅ Sistema completo de autenticação (login, registro, recuperação de senha)
- ✅ Criação dinâmica de personagens com raças e classes
- ✅ Sistema de navegação por rotas organizadas
- ✅ Recuperação de senha por email
- ✅ Interface responsiva e animada
- ✅ Banco de dados SQLite com Prisma ORM
- ✅ Deploy com Docker e Docker Compose

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **Deploy**: Docker, Docker Compose
- **Icons**: Lucide React

## 🎯 Estrutura de Rotas

```
/                    # Home/Intro
/login              # Login e Registro
/heroes             # Lista de heróis do usuário
/heroes/create      # Criação de novos heróis
/reset-password     # Redefinição de senha
```

## 🐳 Instalação com Docker (Recomendado)

### Pré-requisitos
- Docker
- Docker Compose

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone <repo-url>
cd dnd-rpg
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o .env com suas configurações (especialmente SMTP para emails)
```

3. **Execute o script de inicialização**
```bash
./start-docker.sh
```

Ou manualmente:
```bash
docker-compose up --build -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

4. **Acesse a aplicação**
- **App**: http://localhost:3000
- **Prisma Studio** (opcional): http://localhost:5555

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

1. **Instale as dependências**
```bash
npm install
```

2. **Configure o banco de dados**
```bash
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
```

3. **Execute o projeto**
```bash
npm run dev
```

## 📊 Scripts Disponíveis

### NPM Scripts
```bash
npm run dev           # Desenvolvimento local
npm run build         # Build para produção
npm run start         # Iniciar em produção
npm run lint          # Linter
npm run db:generate   # Gerar Prisma Client
npm run db:migrate    # Executar migrações
npm run db:studio     # Abrir Prisma Studio
npm run db:seed       # Semear banco com dados
```

### Docker Scripts
```bash
npm run docker:start  # Iniciar com Docker
npm run docker:stop   # Parar containers
npm run docker:logs   # Ver logs da aplicação
npm run docker:shell  # Acessar terminal do container
```

## 🗃️ Banco de Dados

### Estrutura Principal
- **Users**: Sistema de usuários com autenticação
- **Characters**: Personagens criados pelos usuários  
- **Races**: Raças disponíveis (Humano, Elfo, Anão, etc.)
- **CharacterClasses**: Classes disponíveis (Guerreiro, Mago, Ladino, etc.)

### Dados Pré-populados
O sistema vem com raças e classes pré-configuradas através do seed do banco.

## 📧 Configuração de Email

Para o sistema de recuperação de senha funcionar, configure no `.env`:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"  
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
```

### Gmail Setup
1. Ative a verificação em 2 etapas
2. Gere uma senha de aplicativo
3. Use a senha de aplicativo no `SMTP_PASS`

## 🎮 Como Usar

1. **Acesse** http://localhost:3000
2. **Crie uma conta** ou faça login
3. **Crie seu herói** escolhendo raça e classe
4. **Gerencie seus personagens** na área de heróis

## 🔧 Comandos Docker Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f app

# Acessar terminal do container
docker-compose exec app bash

# Executar migrações
docker-compose exec app npx prisma migrate dev

# Parar tudo
docker-compose down

# Rebuild completo
docker-compose up --build --force-recreate
```

## 🚨 Troubleshooting

### Problemas Comuns

**Container não inicia:**
- Verifique se o Docker está rodando
- Verifique se as portas 3000 e 5555 estão livres

**Erro de permissão:**
```bash
sudo chmod +x start-docker.sh
```

**Banco de dados não inicializa:**
```bash
docker-compose exec app npx prisma migrate reset
docker-compose exec app npx prisma db seed
```

## 📝 Desenvolvimento

### Adicionando Nova Rota
1. Crie pasta em `app/sua-rota/`
2. Adicione `page.tsx` na pasta
3. Implemente o componente

### Modificando Banco de Dados
1. Edite `prisma/schema.prisma`
2. Execute `npx prisma migrate dev`
3. Atualize o seed se necessário

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🎲 Que as aventuras comecem! ⚔️**
