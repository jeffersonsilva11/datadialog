import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GoogleAnalyticsClient } from "@/lib/google-analytics/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Buscar as credenciais do Google do usuário
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "google",
      },
    });

    if (!account || !account.access_token) {
      return NextResponse.json(
        { error: "Google account not linked" },
        { status: 400 }
      );
    }

    // Verificar se a conexão funciona
    const gaClient = new GoogleAnalyticsClient(
      account.access_token,
      account.refresh_token
    );

    try {
      // Buscar informações da propriedade para confirmar acesso e pegar o nome
      const properties = await gaClient.listProperties();

      let propertyName = null;
      if (properties.content && Array.isArray(properties.content)) {
        const propertyInfo = properties.content.find((p: any) =>
          p.name?.includes(propertyId)
        );
        propertyName = propertyInfo?.displayName || null;
      }

      // Salvar no banco
      const connection = await prisma.analyticsConnection.upsert({
        where: {
          userId_propertyId: {
            userId: session.user.id,
            propertyId,
          },
        },
        update: {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
          isActive: true,
          propertyName,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          propertyId,
          propertyName,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
          isActive: true,
        },
      });

      return NextResponse.json({ success: true, connection });
    } catch (mcpError) {
      console.error("MCP connection test failed:", mcpError);
      return NextResponse.json(
        { error: "Failed to connect to Google Analytics. Please check your credentials." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error connecting GA:", error);
    return NextResponse.json(
      { error: "Failed to connect Google Analytics" },
      { status: 500 }
    );
  }
}
