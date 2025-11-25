"use client";

import { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Bem-vindo ao DataDialog
          </h3>
          <p className="text-muted-foreground mb-4">
            Faça perguntas sobre seus dados do Google Analytics
          </p>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Exemplos de perguntas:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Quantos usuários visitaram meu site nos últimos 7 dias?</li>
              <li>Quais são as páginas mais visualizadas?</li>
              <li>De onde vem meu tráfego?</li>
              <li>Qual a taxa de conversão este mês?</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageItem key={message.id || index} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
