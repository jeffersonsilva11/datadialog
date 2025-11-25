"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { AnalyticsConnection } from "@/types/analytics";

interface ConnectionStatusProps {
  connection: AnalyticsConnection | null;
}

export function ConnectionStatus({ connection }: ConnectionStatusProps) {
  if (!connection) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <XCircle className="h-4 w-4 text-destructive" />
        <span>Google Analytics não conectado</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span>
        Conectado: {connection.propertyName || connection.propertyId}
      </span>
    </div>
  );
}
