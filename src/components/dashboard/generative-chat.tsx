"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export function GenerativeChat({ tenantId }: { tenantId: string }) {
    // @ts-ignore
    const { messages, append, isLoading } = useChat() as any;
    const [inputLocal, setInputLocal] = useState("");

    const internalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputLocal.trim()) return;
        if (append) append({ role: 'user', content: inputLocal });
        setInputLocal("");
    };

    return (
        <Card className="w-full h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>Comite IA</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 mb-4 p-4 border rounded-md">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`flex max-w-[80%] rounded-lg p-3 ${m.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                    }`}
                            >
                                {m.role === "user" ? (
                                    m.content
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert">
                                        {m.content}
                                        {/* Here we would render the Generative UI components returned by the LLM 
                         using a UI parsing logic if we were streaming component schemas. 
                         For MVP, we show the explanation text.
                     */}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    )}
                </ScrollArea>
                <form onSubmit={internalSubmit} className="flex gap-2">
                    <Input
                        value={inputLocal}
                        onChange={(e) => setInputLocal(e.target.value)}
                        placeholder="Ex: Mude o cabeçalho para azul..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !inputLocal.trim()}>
                        Enviar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
