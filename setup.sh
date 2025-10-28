#!/bin/bash

# Script de setup rápido do projeto

echo "🐳 Setup do Sistema de Vendas"
echo "=============================="
echo ""

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado!"
    echo "Instale em: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker encontrado!"
echo ""

# Build
echo "📦 Fazendo build das imagens..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build!"
    exit 1
fi

echo ""
echo "✅ Build concluído!"
echo ""

# Up
echo "🚀 Subindo containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Erro ao subir containers!"
    exit 1
fi

echo ""
echo "✅ Containers rodando!"
echo ""

# Aguarda MySQL
echo "⏳ Aguardando MySQL inicializar (15s)..."
sleep 15

# Migrations
echo "📊 Aplicando migrations..."
docker-compose exec -T web python manage.py migrate

if [ $? -ne 0 ]; then
    echo "⚠️  Erro nas migrations, mas containers estão rodando"
fi

echo ""
echo "=============================="
echo "✅ Setup completo!"
echo ""
echo "🌐 Acesse:"
echo "   - Swagger UI: http://localhost:8000/api/docs/"
echo "   - Admin: http://localhost:8000/admin/"
echo ""
echo "📝 Comandos úteis:"
echo "   - make logs      # Ver logs"
echo "   - make down      # Parar"
echo "   - make restart   # Reiniciar"
echo "   - make help      # Todos os comandos"
echo ""
echo "🎉 Bom trabalho!"
