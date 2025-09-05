# Django backend initialization script
#!/bin/bash

echo "🏔️ Configurando Backend do Middle Earth RPG..."

# Navigate to backend directory
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "✨ Ativando ambiente virtual..."
source venv/bin/activate

# Install dependencies
echo "⚡ Instalando dependências..."
pip install -r requirements.txt

# Run migrations
echo "🗃️ Executando migrações do banco de dados..."
python manage.py makemigrations accounts
python manage.py makemigrations characters
python manage.py migrate

# Create superuser (optional)
echo "👤 Criar superusuário? (y/n)"
read create_superuser
if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    python manage.py createsuperuser
fi

# Initialize game data
echo "🎲 Inicializando dados do jogo..."
python manage.py init_game_data

echo "✅ Backend configurado com sucesso!"
echo "🚀 Para iniciar o servidor: cd backend && source venv/bin/activate && python manage.py runserver"
