import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import type { Adapter } from "next-auth/adapters";

// Criar um adapter customizado que filtra campos não suportados
export function CustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma);

  return {
    ...baseAdapter,
    linkAccount: async (account) => {
      // Remover campos não suportados pelo schema
      const { refresh_token_expires_in, ...validAccount } = account as any;

      // Chamar o linkAccount original com apenas os campos válidos
      return baseAdapter.linkAccount!(validAccount);
    },
  };
}
