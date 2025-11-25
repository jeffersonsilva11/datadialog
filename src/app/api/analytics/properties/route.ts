import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GoogleAnalyticsClient } from "@/lib/google-analytics/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const gaClient = new GoogleAnalyticsClient(
      account.access_token,
      account.refresh_token
    );

    try {
      const result = await gaClient.listProperties();
      return NextResponse.json({ properties: result.content || [] });
    } catch (error) {
      console.error("Detailed GA API Error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return NextResponse.json(
        { error: `Failed to fetch properties: ${error instanceof Error ? error.message : String(error)}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error listing properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
