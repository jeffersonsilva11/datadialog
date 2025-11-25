#!/bin/bash
set -e

echo "🚀 Configurando SQLite para DataDialog..."
echo ""

# Atualizar .env.local
echo "📝 Atualizando .env.local..."
if [ -f .env.local ]; then
    # Criar backup
    cp .env.local .env.local.backup
    echo "   ✓ Backup criado (.env.local.backup)"
    
    # Substituir DATABASE_URL
    if grep -q "DATABASE_URL=" .env.local; then
        sed -i 's|DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|' .env.local
        echo "   ✓ DATABASE_URL atualizada"
    else
        echo "DATABASE_URL=\"file:./dev.db\"" >> .env.local
        echo "   ✓ DATABASE_URL adicionada"
    fi
else
    echo "   ⚠️  .env.local não encontrado, criando..."
    cp .env.example .env.local
    sed -i 's|DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|' .env.local
    echo "   ✓ .env.local criado com SQLite"
fi

echo ""
echo "🔧 Gerando Prisma Client..."
npx prisma generate

echo ""
echo "📦 Criando banco de dados e executando migrações..."
npx prisma migrate dev --name init

echo ""
echo "✅ Setup completo!"
echo ""
echo "👉 Agora execute: npm run dev"
echo ""
