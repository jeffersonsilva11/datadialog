export interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: {
    data?: any;
    chart?: {
      chartType: string;
      config: any;
    };
    parameters?: any;
    intent?: string;
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  title?: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
