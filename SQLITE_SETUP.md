# Configurar SQLite - Ação Necessária

## Mudança Realizada

Alterei o Prisma de **PostgreSQL** para **SQLite** para desenvolvimento local.

SQLite cria um arquivo de banco de dados local (`dev.db`) e **não precisa de servidor rodando**! 🎉

## O Que Você Precisa Fazer

### 1. Atualizar `.env.local`

Você está com o arquivo aberto! Mude a linha da `DATABASE_URL`:

**De:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/datadialog"
```

**Para:**
```env
DATABASE_URL="file:./dev.db"
```

Salve o arquivo (Ctrl+S).

### 2. Parar o servidor Next.js

No terminal onde está rodando `npm run dev`, pressione **Ctrl+C** para parar.

### 3. Gerar o Prisma Client e Executar Migrações

Execute estes comandos:

```bash
cd /home/nix010825/Área de Trabalho/datadialog

# Gerar o cliente Prisma com a nova configuração
npx prisma generate

# Criar o banco de dados SQLite e executar migrações
npx prisma migrate dev --name init

# Reiniciar o servidor
npm run dev
```

### 4. Testar

Acesse `http://localhost:3000` e:
- ✅ Não deve mais ter loop de redirecionamento
- ✅ Deve levar você para `/login`
- ✅ Após login com Google, vai para `/dashboard`
- ✅ Conectar propriedade GA → Chat interface aparece!

## O Que Vai Acontecer

Quando você rodar `npx prisma migrate dev`:
1. O Prisma vai criar um arquivo `dev.db` na raiz do projeto
2. Vai criar todas as tabelas necessárias (Account, User, Session, etc.)
3. O NextAuth vai funcionar perfeitamente!

Não precisa instalar ou configurar PostgreSQL! 🚀
