import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MCPAnalyticsClient } from "@/lib/mcp/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, accessToken, refreshToken, expiresAt } =
      await req.json();

    if (!propertyId || !accessToken) {
      return NextResponse.json(
        { error: "Property ID and access token are required" },
        { status: 400 }
      );
    }

    // Verificar se a conexão funciona tentando conectar ao MCP
    const mcpClient = new MCPAnalyticsClient();

    try {
      await mcpClient.connect(propertyId, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      // Buscar informações da propriedade
      const properties = await mcpClient.listProperties();

      let propertyName = null;
      if (properties.content && Array.isArray(properties.content)) {
        const propertyInfo = properties.content.find((p: any) =>
          p.name?.includes(propertyId)
        );
        propertyName = propertyInfo?.displayName || null;
      }

      await mcpClient.disconnect();
    } catch (mcpError) {
      console.error("MCP connection test failed:", mcpError);
      return NextResponse.json(
        { error: "Failed to connect to Google Analytics. Please check your credentials." },
        { status: 400 }
      );
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
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        propertyId,
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, connection });
  } catch (error) {
    console.error("Error connecting GA:", error);
    return NextResponse.json(
      { error: "Failed to connect Google Analytics" },
      { status: 500 }
    );
  }
}
