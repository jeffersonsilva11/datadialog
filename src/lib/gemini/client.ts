import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  QUERY_ANALYSIS_PROMPT,
  CHART_RECOMMENDATION_PROMPT,
  INSIGHTS_GENERATION_PROMPT,
} from "./prompts";
import type {
  QueryAnalysis,
  ChartRecommendation,
  AnalyticsContext,
} from "./types";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is required");
    }

    this.genAI = new GoogleGenerativeAI(key);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
  }

  async analyzeQuery(
    userQuery: string,
    analyticsContext: AnalyticsContext
  ): Promise<QueryAnalysis> {
    try {
      const prompt = QUERY_ANALYSIS_PROMPT(userQuery, analyticsContext);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Remove markdown code blocks se existirem
      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

      const parsed = JSON.parse(cleanText);

      // Validar estrutura básica
      if (!parsed.intent || !parsed.parameters || !parsed.naturalLanguageResponse) {
        throw new Error("Invalid response structure from Gemini");
      }

      return parsed as QueryAnalysis;
    } catch (error) {
      console.error("Error analyzing query with Gemini:", error);
      throw new Error(`Failed to analyze query: ${error}`);
    }
  }

  async generateChartRecommendation(data: any): Promise<ChartRecommendation> {
    try {
      const prompt = CHART_RECOMMENDATION_PROMPT(data);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

      const parsed = JSON.parse(cleanText);

      // Validar estrutura
      if (!parsed.chartType || !parsed.config) {
        throw new Error("Invalid chart recommendation structure");
      }

      return parsed as ChartRecommendation;
    } catch (error) {
      console.error("Error generating chart recommendation:", error);
      // Retornar recomendação padrão em caso de erro
      return {
        chartType: "bar",
        config: {
          xAxis: "dimension",
          yAxis: "metric",
          title: "Visualização de Dados",
        },
      };
    }
  }

  async generateInsights(data: any, query: string): Promise<string> {
    try {
      const prompt = INSIGHTS_GENERATION_PROMPT(data, query);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating insights:", error);
      return "Não foi possível gerar insights neste momento. Por favor, tente novamente.";
    }
  }

  async streamInsights(
    data: any,
    query: string
  ): Promise<ReadableStream<string>> {
    try {
      const prompt = INSIGHTS_GENERATION_PROMPT(data, query);

      const result = await this.model.generateContentStream(prompt);

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              controller.enqueue(text);
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
    } catch (error) {
      console.error("Error streaming insights:", error);
      throw error;
    }
  }
}
