"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ThemeConfigurator({
    initialColor = "#0f172a",
    initialHeadingFont = "Inter",
    initialBodyFont = "Inter",
    onSave
}: {
    initialColor?: string;
    initialHeadingFont?: string;
    initialBodyFont?: string;
    onSave?: (data: any) => void;
}) {
    const [color, setColor] = useState(initialColor);
    const [headingFont, setHeadingFont] = useState(initialHeadingFont);
    const [bodyFont, setBodyFont] = useState(initialBodyFont);

    const handleSave = () => {
        if (onSave) {
            onSave({ themeColor: color, fontHeading: headingFont, fontBody: bodyFont });
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="color">Cor Principal</Label>
                    <div className="flex gap-4 items-center">
                        <Input
                            id="color"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-16 h-10 p-1"
                        />
                        <span className="text-sm text-muted-foreground uppercase font-mono">{color}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Tipografia para Títulos</Label>
                    <Select value={headingFont} onValueChange={setHeadingFont}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma fonte" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Inter">Inter (Moderna/Neutra)</SelectItem>
                            <SelectItem value="Merriweather">Merriweather (Tradicional/Séria)</SelectItem>
                            <SelectItem value="Oswald">Oswald (Forte/Impactante)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Tipografia para Corpo do Texto</Label>
                    <Select value={bodyFont} onValueChange={setBodyFont}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma fonte" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="pt-4">
                    <Button onClick={handleSave} className="w-full">Salvar Identidade</Button>
                </div>
            </CardContent>
        </Card>
    );
}
