"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChartRenderer } from "./ChartRenderer";
import { User, Bot } from "lucide-react";
import type { Message } from "@/types/chat";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } mb-6`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`flex-1 ${isUser ? "text-right" : "text-left"} max-w-[80%]`}>
        <div
          className={`inline-block rounded-lg px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {message.metadata?.chart && message.metadata?.data && (
          <div className={isUser ? "text-left" : ""}>
            <ChartRenderer
              data={message.metadata.data}
              config={message.metadata.chart}
            />
          </div>
        )}

        <span className="text-xs text-muted-foreground mt-1 block px-1">
          {format(new Date(message.createdAt), "HH:mm", { locale: ptBR })}
        </span>
      </div>
    </div>
  );
}
