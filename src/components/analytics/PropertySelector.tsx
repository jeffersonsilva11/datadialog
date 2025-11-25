"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, BarChart3, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Property {
    name: string;
    displayName: string;
    propertyType: string;
}

export function PropertySelector() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchProperties = async () => {
        try {
            const response = await fetch("/api/analytics/properties");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch properties");
            }

            setProperties(data.properties || []);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError("Não foi possível carregar suas propriedades do Analytics.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleConnect = async () => {
        if (!selectedProperty) return;

        try {
            setIsSaving(true);
            setError(null);

            // Extract ID from resource name (properties/12345 -> 12345)
            const propertyId = selectedProperty.split("/").pop();

            const response = await fetch("/api/analytics/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    propertyId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to connect property");
            }

            router.refresh();
        } catch (err) {
            console.error("Error connecting property:", err);
            setError("Erro ao conectar a propriedade. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                    Carregando suas propriedades...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="max-w-md mx-auto border-destructive/50">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="bg-destructive/10 p-3 rounded-full">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-destructive">Erro ao carregar propriedades</h3>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => window.location.reload()} variant="outline">
                                Recarregar Página
                            </Button>
                            <Button onClick={() => { setError(null); setIsLoading(true); fetchProperties(); }} variant="default">
                                Tentar Novamente
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Selecione a Propriedade
                </CardTitle>
                <CardDescription>
                    Escolha qual propriedade do Google Analytics 4 você deseja analisar.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Propriedade</label>
                    <Select
                        value={selectedProperty}
                        onValueChange={setSelectedProperty}
                        disabled={isSaving}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma propriedade..." />
                        </SelectTrigger>
                        <SelectContent>
                            {properties.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                    Nenhuma propriedade encontrada
                                </div>
                            ) : (
                                properties.map((prop) => (
                                    <SelectItem key={prop.name} value={prop.name}>
                                        {prop.displayName}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className="w-full"
                    onClick={handleConnect}
                    disabled={!selectedProperty || isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Conectando...
                        </>
                    ) : (
                        "Conectar e Continuar"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
