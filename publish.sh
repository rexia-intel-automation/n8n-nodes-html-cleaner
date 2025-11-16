#!/bin/bash

# Script de publicação para @mohamad-rexia/n8n-nodes-html-cleaner
# Uso: ./publish.sh [patch|minor|major]

set -e

echo "🚀 Iniciando processo de publicação..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está logado no npm
echo "1️⃣ Verificando login no npm..."
if ! npm whoami &> /dev/null; then
    echo -e "${RED}❌ Você não está logado no npm!${NC}"
    echo "Execute: npm login"
    exit 1
fi

USER=$(npm whoami)
echo -e "${GREEN}✅ Logado como: $USER${NC}"
echo ""

# Verificar branch atual
BRANCH=$(git branch --show-current)
echo "2️⃣ Branch atual: $BRANCH"
echo ""

# Limpar build anterior
echo "3️⃣ Limpando build anterior..."
npm run clean
echo -e "${GREEN}✅ Build anterior removido${NC}"
echo ""

# Reinstalar dependências (opcional, comentado por padrão)
# echo "4️⃣ Reinstalando dependências..."
# rm -rf node_modules package-lock.json
# npm install
# echo -e "${GREEN}✅ Dependências instaladas${NC}"
# echo ""

# Build
echo "4️⃣ Compilando projeto..."
npm run build
echo -e "${GREEN}✅ Projeto compilado${NC}"
echo ""

# Verificar arquivos que serão publicados
echo "5️⃣ Arquivos que serão publicados:"
npm pack --dry-run 2>&1 | grep "npm notice" | head -30
echo ""

# Perguntar se deseja continuar
read -p "Deseja continuar com a publicação? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Publicação cancelada${NC}"
    exit 0
fi

# Atualizar versão se especificado
VERSION_TYPE=${1:-""}
if [ ! -z "$VERSION_TYPE" ]; then
    echo "6️⃣ Atualizando versão ($VERSION_TYPE)..."
    npm version $VERSION_TYPE --no-git-tag-version
    NEW_VERSION=$(cat package.json | grep '"version"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Nova versão: $NEW_VERSION${NC}"
    echo ""

    # Commit da nova versão
    git add package.json
    git commit -m "chore: bump version to $NEW_VERSION"
    echo -e "${GREEN}✅ Versão commitada${NC}"
    echo ""
fi

# Publicar
echo "7️⃣ Publicando no npm..."
if npm publish --access public; then
    VERSION=$(cat package.json | grep '"version"' | cut -d'"' -f4)
    echo ""
    echo -e "${GREEN}🎉 Publicado com sucesso!${NC}"
    echo ""
    echo "📦 Pacote: @mohamad-rexia/n8n-nodes-html-cleaner@$VERSION"
    echo "🔗 npm: https://www.npmjs.com/package/@mohamad-rexia/n8n-nodes-html-cleaner"
    echo ""
    echo "Para instalar no n8n:"
    echo "  Settings → Community Nodes → Install"
    echo "  Digite: @mohamad-rexia/n8n-nodes-html-cleaner"
    echo ""

    # Perguntar se deseja fazer push
    read -p "Deseja fazer push para o GitHub? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push
        echo -e "${GREEN}✅ Push realizado${NC}"
    fi
else
    echo -e "${RED}❌ Erro ao publicar${NC}"
    exit 1
fi
