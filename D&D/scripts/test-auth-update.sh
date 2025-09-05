#!/bin/bash

echo "🧪 Testando sistema de autenticação atualizado..."
echo ""

# Teste 1: Login com email
echo "📧 Teste 1: Login com email"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrNickname": "admin@exemplo.com", "senha": "123456"}' \
  | python3 -m json.tool
echo ""

# Teste 2: Login com nickname
echo "👤 Teste 2: Login com nickname"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrNickname": "admin_usuario", "senha": "123456"}' \
  | python3 -m json.tool
echo ""

# Teste 3: Solicitar redefinição de senha
echo "🔄 Teste 3: Solicitar redefinição de senha"
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"emailOrNickname": "admin@exemplo.com"}' \
  | python3 -m json.tool
echo ""

# Teste 4: Registro com novo formato
echo "📝 Teste 4: Registro com nickname"
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "nickname": "joao_aventureiro", "email": "joao@exemplo.com", "senha": "123456"}' \
  | python3 -m json.tool
echo ""

echo "✅ Testes concluídos!"
