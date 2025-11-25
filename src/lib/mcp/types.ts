export interface MCPToolResult {
  content: any[];
  isError?: boolean;
}

export interface GAReportParams {
  startDate: string;
  endDate: string;
  dimensions?: Array<{ name: string }>;
  metrics?: Array<{ name: string }>;
  dimensionFilter?: any;
  limit?: number;
  offset?: number;
}

export interface GACredentials {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_at?: number;
}
