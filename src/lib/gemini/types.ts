export interface QueryAnalysis {
  intent: string;
  parameters: {
    startDate: string;
    endDate: string;
    dimensions?: Array<{ name: string }>;
    metrics?: Array<{ name: string }>;
    filters?: any;
  };
  naturalLanguageResponse: string;
}

export interface ChartRecommendation {
  chartType: "line" | "bar" | "pie" | "area" | "scatter";
  config: {
    xAxis: string;
    yAxis: string;
    title: string;
  };
}

export interface AnalyticsContext {
  propertyId: string;
  propertyName?: string;
  availableMetrics?: string[];
  availableDimensions?: string[];
}
