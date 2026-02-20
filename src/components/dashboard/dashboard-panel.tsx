"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeConfigurator } from "./theme-configurator";
import { GenerativeChat } from "./generative-chat";

export function DashboardPanel({ tenantId }: { tenantId: string }) {
    const [activeTab, setActiveTab] = useState("theme");

    return (
        <div className="container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
            {/* Editor Panel */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Painel da Campanha</h1>
                <p className="text-muted-foreground mb-4">
                    Gerencie a identidade visual e os componentes da sua landing page.
                </p>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="theme">Tema Clássico</TabsTrigger>
                        <TabsTrigger value="ai">Assistente IA</TabsTrigger>
                    </TabsList>

                    <TabsContent value="theme" className="mt-4">
                        <ThemeConfigurator
                            onSave={(data) => {
                                console.log("Saving theme to DB:", data);
                                // POST to API route
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="ai" className="mt-4">
                        <GenerativeChat tenantId={tenantId} />
                    </TabsContent>

                </Tabs>
            </div>

            {/* Real-time Preview */}
            <div className="flex-1 border rounded-lg overflow-hidden bg-muted relative min-h-[600px] flex items-center justify-center">
                {/* Placeholder for iframe / preview rendering */}
                <div className="text-center p-8">
                    <h3 className="font-semibold text-lg text-muted-foreground mb-2">Editor Preview</h3>
                    <p className="text-sm text-muted-foreground">Nesta área, a landing page do candidato será renderizada em tempo real usando iframes ou componentes React híbridos refletindo as alterações do tema ou as injeções da Inteligência Artificial.</p>
                </div>
            </div>
        </div>
    );
}
