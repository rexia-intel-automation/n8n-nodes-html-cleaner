# 🧹 n8n-nodes-html-cleaner

[![npm version](https://badge.fury.io/js/%40mohamad-rexia%2Fn8n-nodes-html-cleaner.svg)](https://www.npmjs.com/package/@mohamad-rexia/n8n-nodes-html-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Overview

**HTML Cleaner** é um node customizado para o **n8n**, desenvolvido pela **RexIA**, que limpa e sanitiza HTML obtido de scrapers, APIs ou crawlers. Remove scripts, estilos, atributos e normaliza o conteúdo antes de enviar para LLMs ou processar em workflows.

Ideal para:
- 🔍 **Scraping limpo** antes de análises por IA
- 🧠 **Preparar textos para modelos generativos** (LLMs)
- ⚙️ **Normalização de HTML em pipelines de dados**
- 🎯 **Remoção de conteúdo indesejado** (scripts, styles, ads)

---

## 🚀 Instalação

### Opção 1: Via npm (Community Node)

```bash
npm install @mohamad-rexia/n8n-nodes-html-cleaner
```

### Opção 2: Instalação Manual no n8n Auto-hospedado

1. **Navegue até o diretório do n8n:**
```bash
cd ~/.n8n/custom
```

2. **Clone o repositório ou instale via npm:**
```bash
npm install @mohamad-rexia/n8n-nodes-html-cleaner
```

3. **Ou instale via interface do n8n:**
   - Vá em **Settings** → **Community Nodes**
   - Clique em **Install**
   - Digite: `@mohamad-rexia/n8n-nodes-html-cleaner`
   - Clique em **Install**

4. **Reinicie o n8n:**
```bash
# Se estiver rodando com npm
pm2 restart n8n

# Ou se estiver rodando com docker
docker restart n8n
```

---

## 📋 Funcionalidades

### Operações Disponíveis

#### 1. **Remove HTML Tags**
Remove todas as tags HTML do conteúdo, deixando apenas o texto puro.

**Opções:**
- Preservar quebras de linha (converte `<br>`, `</p>`, etc. em `\n`)
- Decodificar entidades HTML (`&nbsp;`, `&lt;`, etc.)
- Substituição personalizada

#### 2. **Clean with Regex**
Limpa o conteúdo usando um padrão regex personalizado.

**Opções:**
- Padrão regex customizável
- Flags regex (g, i, m, etc.)
- Texto de substituição

#### 3. **Strip Scripts and Styles**
Remove tags `<script>` e `<style>` com todo o conteúdo interno, além de:
- Atributos `style` inline
- Event handlers (`onclick`, `onload`, etc.)

#### 4. **Remove Attributes**
Remove todos os atributos das tags HTML, mantendo apenas os nomes das tags.

Exemplo: `<div class="foo" id="bar">` → `<div>`

#### 5. **Normalize Whitespace**
Normaliza espaços em branco:
- Remove espaços múltiplos
- Normaliza quebras de linha
- Remove espaços no início e fim das linhas
- Decodifica entidades HTML (opcional)

### Opções Globais

- **Field to Clean**: Campo específico para limpar (deixe vazio para limpar todos os campos string)
- **Trim Result**: Remove espaços em branco do início e fim do resultado

---

## 💡 Exemplos de Uso

### Exemplo 1: Limpar HTML para LLM

```
Input:
{
  "html": "<html><head><script>alert('test');</script></head><body><h1>Hello World</h1><p>This is a test.</p></body></html>"
}

Operation: Remove HTML Tags
Preserve Line Breaks: Yes
Decode Entities: Yes

Output:
{
  "html": "Hello World\n\nThis is a test."
}
```

### Exemplo 2: Remover Scripts e Estilos

```
Input:
{
  "content": "<div><style>.test{color:red;}</style><script>alert('hi');</script><p>Content</p></div>"
}

Operation: Strip Scripts and Styles

Output:
{
  "content": "<div><p>Content</p></div>"
}
```

### Exemplo 3: Regex Personalizado

```
Input:
{
  "text": "Email: test@example.com, Phone: 123-456-7890"
}

Operation: Clean with Regex
Regex Pattern: \b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b
Regex Flags: g
Replacement: [REDACTED]

Output:
{
  "text": "Email: [REDACTED], Phone: 123-456-7890"
}
```

---

## 🛠️ Desenvolvimento

### Build Local

```bash
# Instalar dependências
npm install

# Build
npm run build

# Limpar build
npm run clean
```

### Estrutura do Projeto

```
n8n-nodes-html-cleaner/
├── nodes/
│   └── HtmlCleaner/
│       ├── HtmlCleaner.node.ts    # Implementação do node
│       └── htmlCleaner.svg        # Ícone do node
├── src/
│   └── index.ts                   # Export principal
├── dist/                          # Arquivos compilados (gerado)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 Publicação

```bash
# Build
npm run build

# Publicar no npm
npm publish
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📧 Suporte

- **Issues**: [GitHub Issues](https://github.com/rexia-intel-automation/n8n-nodes-html-cleaner/issues)
- **Email**: mohamad@rexia.com.br

---

## 🏢 Sobre a RexIA

Desenvolvido com ❤️ pela [RexIA](https://rexia.com.br) - Automação Inteligente

---

## 📚 Recursos Adicionais

- [Documentação do n8n](https://docs.n8n.io/)
- [Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Forum](https://community.n8n.io/)
