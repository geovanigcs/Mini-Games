# Django backend with Next.js frontend runner
#!/bin/bash

echo "🏔️ Iniciando Middle Earth RPG (Full Stack)..."

# Function to run backend
run_backend() {
    echo "🐍 Iniciando Django backend na porta 8000..."
    cd backend
    source venv/bin/activate
    python manage.py runserver 8000 &
    BACKEND_PID=$!
    cd ..
}

# Function to run frontend
run_frontend() {
    echo "⚡ Iniciando Next.js frontend na porta 3000..."
    npm run dev &
    FRONTEND_PID=$!
}

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Parando servidores..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Check if backend is set up
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend não configurado. Execute primeiro: bash setup_backend.sh"
    exit 1
fi

# Start both servers
run_backend
sleep 3
run_frontend

echo ""
echo "🎮 Middle Earth RPG está rodando!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend Admin: http://localhost:8000/admin"
echo "📡 Backend API: http://localhost:8000/api"
echo ""
echo "Pressione Ctrl+C para parar ambos os servidores"

# Wait for processes
wait
