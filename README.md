# DataDialog - Interface de Analytics Conversacional com Google Analytics MCP

![DataDialog](https://img.shields.io/badge/Status-Beta-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

DataDialog é uma aplicação web moderna que permite fazer perguntas em linguagem natural sobre seus dados do Google Analytics, usando IA (Gemini) e o Model Context Protocol (MCP) do Google Analytics.

## ✨ Funcionalidades

- 🤖 **Análise Conversacional**: Faça perguntas em português sobre seus dados
- 📊 **Visualizações Automáticas**: Gráficos gerados automaticamente pela IA
- 🎯 **Insights Inteligentes**: Análises e recomendações baseadas em IA
- 🔐 **Autenticação Segura**: Login com Google OAuth
- 💬 **Interface de Chat**: Experiência conversacional intuitiva
- 📈 **Integração GA4**: Acesso direto aos dados do Google Analytics 4

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Autenticação**: NextAuth.js com Google OAuth
- **Database**: PostgreSQL com Prisma ORM
- **IA**: Google Gemini 2.0
- **Analytics**: Google Analytics MCP Server
- **Visualização**: Recharts

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 18+
- PostgreSQL
- npm ou yarn
- Conta Google Cloud com acesso ao Google Analytics

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/datadialog.git
cd datadialog
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/datadialog"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# Gemini API
GEMINI_API_KEY="sua-gemini-api-key"

# Node Environment
NODE_ENV="development"
```

### 4. Configure o Google Cloud

#### 4.1 Criar projeto no Google Cloud Console

1. Acesse https://console.cloud.google.com
2. Crie um novo projeto
3. Ative as seguintes APIs:
   - Google Analytics Data API
   - Google Analytics Admin API

#### 4.2 Configurar OAuth 2.0

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth client ID"
3. Escolha "Web application"
4. Configure:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. Copie o Client ID e Client Secret para o `.env.local`

#### 4.3 Obter Gemini API Key

1. Acesse https://makersuite.google.com/app/apikey
2. Crie uma nova API key
3. Copie para o `.env.local`

### 5. Configure o banco de dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para visualizar o banco
npx prisma studio
```

### 6. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📖 Como usar

### 1. Faça login

- Acesse `http://localhost:3000`
- Clique em "Entrar com Google"
- Autorize o acesso ao Google Analytics

### 2. Conecte o Google Analytics

- Após o login, conecte sua propriedade do Google Analytics
- Você será redirecionado para o dashboard

### 3. Faça perguntas

Exemplos de perguntas que você pode fazer:

- "Quantos usuários visitaram meu site nos últimos 7 dias?"
- "Quais são as 10 páginas mais visualizadas este mês?"
- "De onde vem meu tráfego?"
- "Qual é a taxa de rejeição do meu site?"
- "Mostre a evolução de usuários nos últimos 30 dias"
- "Qual dispositivo tem mais conversões?"

## 🏗️ Estrutura do Projeto

```
datadialog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rotas de autenticação
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── api/               # API Routes
│   │   └── providers.tsx      # Providers (SessionProvider)
│   ├── components/            # Componentes React
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── analytics/         # Componentes de analytics
│   │   ├── chat/              # Interface do chat
│   │   └── ui/                # Componentes UI (shadcn/ui)
│   ├── lib/                   # Bibliotecas e utilitários
│   │   ├── auth.ts           # Configuração NextAuth
│   │   ├── db.ts             # Cliente Prisma
│   │   ├── mcp/              # Cliente MCP
│   │   └── gemini/           # Cliente Gemini
│   └── types/                # Tipos TypeScript
├── prisma/
│   └── schema.prisma         # Schema do banco
└── public/                   # Arquivos públicos
```

## 🔧 Scripts disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Prisma Studio (visualizar banco)
npx prisma studio

# Reset do banco de dados
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Erro de conexão com o banco de dados

- Certifique-se de que o PostgreSQL está rodando
- Verifique a string de conexão no `.env.local`
- Execute `npx prisma migrate dev`

### Erro de autenticação Google

- Verifique se as URLs de redirect estão corretas no Google Cloud Console
- Confirme que o `NEXTAUTH_URL` está correto no `.env.local`
- Limpe os cookies do navegador

### Erro ao conectar Google Analytics

- Verifique se você tem acesso à propriedade do GA4
- Certifique-se de que as APIs estão habilitadas no Google Cloud
- Verifique se o scope de OAuth inclui `analytics.readonly`

### Erro com Gemini API

- Verifique se a API key é válida
- Confirme que você tem créditos/quota disponível
- Teste a key diretamente na API do Gemini

## 🚢 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Configure o banco de dados (Vercel Postgres ou Supabase)
5. Deploy!

```bash
# Usando Vercel CLI
npm i -g vercel
vercel
```

### Configurações importantes para produção

- Configure o `NEXTAUTH_SECRET` com um valor seguro
- Use `NEXTAUTH_URL` com sua URL de produção
- Configure um banco PostgreSQL em produção
- Atualize as URLs de redirect no Google Cloud Console

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Suporte

Se você tiver alguma dúvida ou problema, por favor:

- Abra uma [issue](https://github.com/seu-usuario/datadialog/issues)
- Entre em contato via email: seu-email@exemplo.com

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Google Gemini](https://ai.google.dev/)
- [Google Analytics MCP](https://github.com/googleanalytics/google-analytics-mcp)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)

---

Feito com ❤️ para análise de dados mais inteligente e conversacional.
