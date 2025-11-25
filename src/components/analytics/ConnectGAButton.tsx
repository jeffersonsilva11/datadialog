"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Chrome, Loader2 } from "lucide-react";

export function ConnectGAButton() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      // Redirecionar para o fluxo de autenticação do Google
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Error connecting:", error);
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      size="lg"
      className="gap-2"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Chrome className="h-5 w-5" />
          Conectar Google Analytics
        </>
      )}
    </Button>
  );
}
