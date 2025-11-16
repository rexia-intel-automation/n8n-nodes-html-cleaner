# 📦 Guia de Publicação no npm

## Passo a Passo para Publicar o Pacote

### 1️⃣ Fazer Login no npm

```bash
# Login no npm
npm login

# Você será solicitado a fornecer:
# - Username: mohamad-rexia
# - Password: [sua senha do npm]
# - Email: mohamad@rexia.com.br
# - One-time password (se tiver 2FA habilitado)
```

**Verificar se está logado:**
```bash
npm whoami
# Deve retornar: mohamad-rexia
```

---

### 2️⃣ Verificar o Pacote

```bash
cd /home/user/n8n-nodes-html-cleaner

# Verificar nome e versão
cat package.json | grep -E '"name"|"version"'

# Fazer um dry-run para ver o que será publicado
npm pack --dry-run
```

**Arquivos que serão incluídos:**
- ✅ README.md
- ✅ package.json
- ✅ dist/nodes/HtmlCleaner/HtmlCleaner.node.js
- ✅ dist/nodes/HtmlCleaner/HtmlCleaner.node.d.ts
- ✅ dist/nodes/HtmlCleaner/htmlCleaner.svg
- ✅ dist/src/index.js
- ✅ dist/src/index.d.ts

**Arquivos que NÃO serão incluídos (por causa do .npmignore):**
- ❌ src/ (código fonte TypeScript)
- ❌ nodes/**/*.ts (código fonte)
- ❌ tsconfig.json
- ❌ .git/
- ❌ node_modules/

---

### 3️⃣ Rebuild Final

Antes de publicar, faça um build limpo:

```bash
# Limpar build anterior
npm run clean

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Build final
npm run build

# Verificar se compilou corretamente
ls -la dist/nodes/HtmlCleaner/
ls -la dist/src/
```

---

### 4️⃣ Verificar se o Nome está Disponível

```bash
# Verificar se o pacote já existe
npm view @mohamad-rexia/n8n-nodes-html-cleaner

# Se retornar erro 404, significa que o nome está disponível
# Se retornar dados do pacote, você está atualizando uma versão existente
```

---

### 5️⃣ Publicar no npm

```bash
# Publicar (certifique-se de estar no diretório do projeto)
cd /home/user/n8n-nodes-html-cleaner

# Publicar
npm publish

# Se for a primeira vez, pode precisar confirmar o acesso público
npm publish --access public
```

**Saída esperada:**
```
npm notice
npm notice 📦  @mohamad-rexia/n8n-nodes-html-cleaner@0.2.0
npm notice === Tarball Contents ===
npm notice 5.3kB README.md
npm notice 13.1kB dist/nodes/HtmlCleaner/HtmlCleaner.node.js
npm notice ...
npm notice === Tarball Details ===
npm notice name:          @mohamad-rexia/n8n-nodes-html-cleaner
npm notice version:       0.2.0
npm notice package size:  8.6 kB
npm notice unpacked size: 30.3 kB
npm notice shasum:        ...
npm notice total files:   11
npm notice
+ @mohamad-rexia/n8n-nodes-html-cleaner@0.2.0
```

---

### 6️⃣ Verificar Publicação

Após publicar, verifique se está disponível:

```bash
# Ver informações do pacote publicado
npm view @mohamad-rexia/n8n-nodes-html-cleaner

# Verificar no site
# Abra: https://www.npmjs.com/package/@mohamad-rexia/n8n-nodes-html-cleaner
```

---

### 7️⃣ Testar Instalação

Teste se o pacote pode ser instalado:

```bash
# Em outro diretório, teste a instalação
cd /tmp
npm install @mohamad-rexia/n8n-nodes-html-cleaner

# Verificar se instalou corretamente
ls -la node_modules/@mohamad-rexia/n8n-nodes-html-cleaner/
```

---

## 🔄 Publicar Atualizações (Futuras Versões)

Quando quiser publicar uma atualização:

### Atualizar versão:

```bash
# Patch (0.2.0 → 0.2.1) - correções de bugs
npm version patch

# Minor (0.2.0 → 0.3.0) - novas funcionalidades
npm version minor

# Major (0.2.0 → 1.0.0) - mudanças breaking
npm version major
```

### Publicar:

```bash
npm run build
npm publish
```

---

## 🚨 Troubleshooting

### Erro: "You must be logged in"
```bash
npm login
npm whoami
```

### Erro: "Package name not available"
O nome já está em uso. Escolha outro nome ou use um scope diferente.

### Erro: "402 Payment Required"
Pacotes com scopes privados requerem conta paga. Use `--access public`:
```bash
npm publish --access public
```

### Erro: "Version already exists"
Você precisa incrementar a versão:
```bash
npm version patch
npm publish
```

### Erro ao fazer login (2FA)
Se você tem autenticação de 2 fatores habilitada:
```bash
npm login
# Você precisará do código OTP do seu app autenticador
```

---

## 📝 Checklist Pré-Publicação

- [ ] Código compilado sem erros (`npm run build`)
- [ ] Versão atualizada no package.json
- [ ] README.md atualizado
- [ ] Logado no npm (`npm whoami`)
- [ ] Dry-run verificado (`npm pack --dry-run`)
- [ ] Tests passando (se houver)
- [ ] Git commit e push feitos

---

## 🎯 Após Publicar

1. **Verifique no npm:**
   https://www.npmjs.com/package/@mohamad-rexia/n8n-nodes-html-cleaner

2. **Instale no n8n:**
   - Settings → Community Nodes → Install
   - Digite: `@mohamad-rexia/n8n-nodes-html-cleaner`
   - Reinicie o n8n

3. **Compartilhe:**
   - Compartilhe o link do npm
   - Adicione ao README
   - Atualize a documentação

---

## 📊 Informações do Pacote Atual

- **Nome:** @mohamad-rexia/n8n-nodes-html-cleaner
- **Versão:** 0.2.0
- **Tamanho:** ~8.6 KB
- **Arquivos:** 11
- **Licença:** MIT
- **Autor:** RexIA <mohamad@rexia.com.br>

---

## 🔗 Links Úteis

- npm Profile: https://www.npmjs.com/~mohamad-rexia
- npm Docs: https://docs.npmjs.com/
- n8n Community Nodes: https://docs.n8n.io/integrations/community-nodes/
