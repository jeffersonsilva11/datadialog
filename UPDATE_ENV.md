# IMPORTANTE: Atualizar .env.local

Você precisa editar o arquivo `.env.local` que está aberto!

**Mudança necessária:**

Localize a linha:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/datadialog"
```

E substitua por:
```env
DATABASE_URL="file:./dev.db"
```

Salve o arquivo (Ctrl+S) e depois me avise!

Após salvar, vou rodar automaticamente:
```bash
npx prisma migrate dev --name init_sqlite
```

Isso vai criar o arquivo `dev.db` com todas as tabelas! 🎉
