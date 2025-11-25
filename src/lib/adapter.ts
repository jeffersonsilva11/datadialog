import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import type { Adapter } from "next-auth/adapters";

// Criar um adapter customizado que filtra campos não suportados
export function CustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma);

  return {
    ...baseAdapter,
    linkAccount: async (account: any) => {
      console.log("[CustomAdapter] linkAccount called with:", {
        provider: account.provider,
        userId: account.userId
      });

      // Explicitly select only the fields that exist in our Prisma schema
      // This prevents "Unknown argument" errors if the provider returns extra fields
      const validAccount = {
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      };

      // Chamar o linkAccount original com apenas os campos válidos
      const result = await baseAdapter.linkAccount!(validAccount as any);
      console.log("[CustomAdapter] linkAccount result:", result);
      return result ?? undefined;
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
