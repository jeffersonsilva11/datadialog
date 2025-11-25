import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MCPAnalyticsClient } from "@/lib/mcp/client";
import { GeminiClient } from "@/lib/gemini/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { message, conversationId } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Buscar ou criar conversa
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId, userId: session.user.id },
      });

      if (!conversation) {
        return new Response(
          JSON.stringify({ error: "Conversation not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
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
      const errorMessage =
        "Você ainda não conectou sua conta do Google Analytics.";

      return new Response(errorMessage, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Stream a resposta
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
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

          // Stream insights
          const insightsStream = await gemini.streamInsights(
            gaData.content,
            message
          );

          const reader = insightsStream.getReader();
          let fullInsights = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            fullInsights += value;
            controller.enqueue(encoder.encode(value));
          }

          // Verificar se precisa de gráfico
          let chartConfig = null;
          if (gaData.content && Array.isArray(gaData.content) && gaData.content.length > 1) {
            try {
              chartConfig = await gemini.generateChartRecommendation(
                gaData.content
              );
            } catch (error) {
              console.error("Error generating chart recommendation:", error);
            }
          }

          await mcpClient.disconnect();

          // Salvar resposta do assistente
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              role: "assistant",
              content: fullInsights,
              metadata: {
                data: gaData.content,
                chart: chartConfig,
                parameters: analysis.parameters,
                intent: analysis.intent,
              },
            },
          });

          controller.close();
        } catch (error) {
          console.error("Error in stream:", error);
          const errorMessage = encoder.encode(
            "\n\nErro ao processar sua mensagem. Por favor, tente novamente."
          );
          controller.enqueue(errorMessage);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error processing stream:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
