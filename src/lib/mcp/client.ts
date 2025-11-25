import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { GAReportParams, GACredentials, MCPToolResult } from "./types";

export class MCPAnalyticsClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private connected: boolean = false;

  async connect(propertyId: string, credentials: GACredentials) {
    try {
      // Criar transporte stdio para o MCP server
      this.transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@googleanalytics/google-analytics-mcp"],
        env: {
          ...process.env,
          GOOGLE_APPLICATION_CREDENTIALS: JSON.stringify(credentials),
          GA_PROPERTY_ID: propertyId,
        },
      });

      // Criar cliente MCP
      this.client = new Client(
        {
          name: "datadialog-client",
          version: "1.0.0",
        },
        {
          capabilities: {},
        }
      );

      // Conectar ao servidor
      await this.client.connect(this.transport);
      this.connected = true;

      return true;
    } catch (error) {
      console.error("Error connecting to MCP server:", error);
      throw new Error(`Failed to connect to MCP server: ${error}`);
    }
  }

  async runReport(params: GAReportParams): Promise<MCPToolResult> {
    if (!this.client || !this.connected) {
      throw new Error("MCP client not connected. Call connect() first.");
    }

    try {
      const result = await this.client.callTool({
        name: "run_report",
        arguments: params,
      });

      return result as MCPToolResult;
    } catch (error) {
      console.error("Error running report:", error);
      throw new Error(`Failed to run report: ${error}`);
    }
  }

  async listProperties(): Promise<MCPToolResult> {
    if (!this.client || !this.connected) {
      throw new Error("MCP client not connected. Call connect() first.");
    }

    try {
      const result = await this.client.callTool({
        name: "list_properties",
        arguments: {},
      });

      return result as MCPToolResult;
    } catch (error) {
      console.error("Error listing properties:", error);
      throw new Error(`Failed to list properties: ${error}`);
    }
  }

  async getMetadata(): Promise<MCPToolResult> {
    if (!this.client || !this.connected) {
      throw new Error("MCP client not connected. Call connect() first.");
    }

    try {
      const result = await this.client.callTool({
        name: "get_metadata",
        arguments: {},
      });

      return result as MCPToolResult;
    } catch (error) {
      console.error("Error getting metadata:", error);
      throw new Error(`Failed to get metadata: ${error}`);
    }
  }

  async disconnect() {
    if (this.transport) {
      try {
        await this.transport.close();
        this.connected = false;
        this.client = null;
        this.transport = null;
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
