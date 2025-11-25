# 🚀 Guia de Configuração do DataDialog

## ✅ Passos Concluídos

1. ✅ Estrutura do projeto criada
2. ✅ Dependências instaladas
3. ✅ Schema do banco configurado
4. ✅ Adapter customizado criado (corrige erro do Google OAuth)
5. ✅ NEXTAUTH_SECRET gerado

## 📋 Configuração Final

### 1. Atualizar `.env.local`

Seu arquivo `.env.local` atual está em `/Users/hitss/Documents/datadialog/.env.local`

**Certifique-se de que está assim:**

```env
# Database (VOCÊ JÁ CONFIGUROU)
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/datadialog"

# NextAuth (JÁ ATUALIZADO)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kgTAdd0Lkj9KMuYsWF3sbg9kJbl9jPYMeHdCcBGTu1w="

# Google OAuth (VERIFIQUE SE ESTÁ CORRETO)
GOOGLE_CLIENT_ID="654129268-mqncd6r7ah9kqg9r01brusjg9c29fe8k.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="SEU_CLIENT_SECRET_AQUI"

# Gemini API (ADICIONE SUA KEY)
GEMINI_API_KEY="sua-gemini-api-key-aqui"

# Node Environment
NODE_ENV="development"
```

### 2. Limpar Sessões e Cookies Antigos

```bash
# 1. Parar o servidor (Ctrl+C)

# 2. Limpar o banco (remove sessões antigas)
npx prisma migrate reset

# Quando perguntar "Are you sure?", digite: yes

# 3. Limpar cookies do navegador
# No Chrome: F12 > Application > Cookies > localhost:3000 > Limpar tudo

# 4. Reiniciar o servidor
npm run dev
```

### 3. Testar o Login

1. Acesse `http://localhost:3000`
2. Clique em **"Entrar com Google"**
3. Autorize o acesso
4. **Agora deve funcionar!** ✅

## 🔍 Debug (Se ainda não funcionar)

O modo debug está ativado. Procure por logs detalhados no terminal após fazer login:

```
[next-auth][debug] ...
```

### Problemas Comuns:

**1. Ainda redireciona para login:**
- Limpe TODOS os cookies do navegador
- Verifique se o `NEXTAUTH_SECRET` está correto no `.env.local`
- Confirme que o banco de dados está acessível

**2. Erro de OAuth:**
- Verifique se o `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
- Confirme as URLs de redirect no Google Cloud Console:
  - Authorized JavaScript origins: `http://localhost:3000`
  - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

**3. Erro de banco:**
- Verifique se o PostgreSQL está rodando: `pg_isready`
- Teste a conexão: `psql -U postgres -d datadialog -c "SELECT 1;"`

## 📊 Próximos Passos (Após Login Funcionar)

1. **Obter Gemini API Key**:
   - Acesse: https://makersuite.google.com/app/apikey
   - Crie uma API key
   - Adicione no `.env.local`

2. **Configurar Google Analytics**:
   - Após fazer login na aplicação
   - Clique em "Conectar Google Analytics"
   - Selecione sua propriedade GA4

3. **Testar o Chat**:
   - Faça perguntas como:
     - "Quantos usuários nos últimos 7 dias?"
     - "Quais as páginas mais visitadas?"
     - "De onde vem meu tráfego?"

## 🆘 Suporte

Se continuar com problemas, compartilhe:
1. O log completo do terminal após tentar fazer login
2. O conteúdo do `.env.local` (SEM as senhas/secrets)
3. A URL que aparece no navegador após o redirect

---

**Versão Atual**: Adapter customizado + NEXTAUTH_SECRET configurado
**Última Atualização**: 2025-11-25
