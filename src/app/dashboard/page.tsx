import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ConnectGAButton } from "@/components/analytics/ConnectGAButton";
import { ConnectionStatus } from "@/components/analytics/ConnectionStatus";
import { PropertySelector } from "@/components/analytics/PropertySelector";
import { UserMenu } from "@/components/auth/UserMenu";
import { MessageSquare } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const gaConnection = await prisma.analyticsConnection.findFirst({
    where: {
      userId: session.user.id,
      isActive: true,
    },
  });

  const googleAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "google",
    },
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DataDialog</h1>
              <p className="text-sm text-muted-foreground">
                Análise conversacional com Google Analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ConnectionStatus connection={gaConnection} />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden bg-gray-50">
        {gaConnection ? (
          <div className="h-full max-w-5xl mx-auto bg-white shadow-sm">
            <ChatInterface />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-md space-y-6 w-full">
              <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  {googleAccount
                    ? "Selecione sua Propriedade"
                    : "Conecte seu Google Analytics"}
                </h2>
                <p className="text-muted-foreground">
                  {googleAccount
                    ? "Escolha qual propriedade você deseja analisar para iniciar o chat."
                    : "Para acessar a interface de chat e conversar com seus dados, você precisa primeiro conectar sua conta do Google Analytics."}
                </p>
              </div>

              {googleAccount ? (
                <PropertySelector />
              ) : (
                <div className="space-y-4">
                  <ConnectGAButton />
                  <p className="text-xs text-muted-foreground">
                    Você será redirecionado para o Google para autorizar o acesso.
                  </p>
                </div>
              )}

              {!googleAccount && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Após conectar, você terá acesso a:
                  </p>
                  <ul className="text-sm text-left space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Interface de chat conversacional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Visualizações automáticas de dados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Insights gerados por IA</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
