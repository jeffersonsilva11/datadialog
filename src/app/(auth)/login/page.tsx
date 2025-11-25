"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, BarChart3, MessageSquare, TrendingUp } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              DataDialog
            </h1>
            <p className="text-xl text-gray-600">
              Converse com seus dados do Google Analytics usando IA
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Análise Conversacional</h3>
                <p className="text-sm text-gray-600">
                  Faça perguntas em linguagem natural e receba insights instantâneos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Visualizações Automáticas</h3>
                <p className="text-sm text-gray-600">
                  Gráficos e visualizações gerados automaticamente pela IA
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Insights Inteligentes</h3>
                <p className="text-sm text-gray-600">
                  Identifique tendências e oportunidades com análise por IA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl text-center">
              Comece Agora
            </CardTitle>
            <CardDescription className="text-center">
              Conecte sua conta do Google para acessar seus dados do Analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full h-12 text-base gap-2"
              size="lg"
            >
              <Chrome className="h-5 w-5" />
              Entrar com Google
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Ao continuar, você concorda com nossos Termos de Serviço e
                Política de Privacidade. Seus dados são seguros e criptografados.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">Durante o beta:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Acesso gratuito e ilimitado
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Todos os recursos disponíveis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Suporte prioritário
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
