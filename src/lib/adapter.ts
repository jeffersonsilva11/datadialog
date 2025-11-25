import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import type { Adapter } from "next-auth/adapters";

// Criar um adapter customizado que filtra campos não suportados
export function CustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma);

  return {
    ...baseAdapter,
    linkAccount: async (account) => {
      console.log("[CustomAdapter] linkAccount called with:", {
        provider: account.provider,
        userId: account.userId
      });

      // Remover campos não suportados pelo schema
      const { refresh_token_expires_in, ...validAccount } = account as any;

      // Chamar o linkAccount original com apenas os campos válidos
      const result = await baseAdapter.linkAccount!(validAccount);
      console.log("[CustomAdapter] linkAccount result:", result);
      return result;
    },
    createSession: async (session) => {
      console.log("[CustomAdapter] createSession called with:", session);
      const result = await baseAdapter.createSession!(session);
      console.log("[CustomAdapter] createSession result:", result);
      return result;
    },
    getSessionAndUser: async (sessionToken) => {
      console.log("[CustomAdapter] getSessionAndUser called with:", sessionToken);
      const result = await baseAdapter.getSessionAndUser!(sessionToken);
      console.log("[CustomAdapter] getSessionAndUser result:", result);
      return result;
    },
  };
}
