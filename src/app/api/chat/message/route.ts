import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MCPAnalyticsClient } from "@/lib/mcp/client";
import { GeminiClient } from "@/lib/gemini/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Buscar ou criar conversa
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId, userId: session.user.id },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    } else {
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 50),
        },
      });
    }

    // Salvar mensagem do usuário
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    // Buscar conexão ativa do GA
    const gaConnection = await prisma.analyticsConnection.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!gaConnection) {
      const errorMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content:
            "Você ainda não conectou sua conta do Google Analytics. Por favor, conecte primeiro para que eu possa ajudá-lo com suas análises.",
        },
      });

      return NextResponse.json({
        success: true,
        conversationId: conversation.id,
        message: errorMessage,
      });
    }

    // Conectar ao MCP
    const mcpClient = new MCPAnalyticsClient();
    await mcpClient.connect(gaConnection.propertyId, {
      access_token: gaConnection.accessToken,
      refresh_token: gaConnection.refreshToken || undefined,
    });

    // Analisar query com Gemini
    const gemini = new GeminiClient();
    const analysis = await gemini.analyzeQuery(message, {
      propertyId: gaConnection.propertyId,
      propertyName: gaConnection.propertyName || undefined,
    });

    // Executar query no GA via MCP
    const gaData = await mcpClient.runReport(analysis.parameters);

    // Gerar insights
    const insights = await gemini.generateInsights(gaData.content, message);

    // Verificar se precisa de gráfico
    let chartConfig = null;
    if (gaData.content && Array.isArray(gaData.content) && gaData.content.length > 1) {
      try {
        chartConfig = await gemini.generateChartRecommendation(gaData.content);
      } catch (error) {
        console.error("Error generating chart recommendation:", error);
      }
    }

    await mcpClient.disconnect();

    // Salvar resposta do assistente
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: insights,
        metadata: {
          data: gaData.content,
          chart: chartConfig,
          parameters: analysis.parameters,
          intent: analysis.intent,
        },
      },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
