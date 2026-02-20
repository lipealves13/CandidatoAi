"use client";

import { useState, useEffect } from "react";

export function ElectionCountdown({ electionDate }: { electionDate: string }) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date(electionDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [electionDate]);

    return (
        <div className="flex justify-center gap-4 text-center">
            <div className="flex flex-col bg-muted/50 p-4 rounded-lg min-w-24">
                <span className="text-4xl font-bold">{timeLeft.days}</span>
                <span className="text-sm text-muted-foreground uppercase">Dias</span>
            </div>
            <div className="flex flex-col bg-muted/50 p-4 rounded-lg min-w-24">
                <span className="text-4xl font-bold">{timeLeft.hours}</span>
                <span className="text-sm text-muted-foreground uppercase">Horas</span>
            </div>
            <div className="flex flex-col bg-muted/50 p-4 rounded-lg min-w-24">
                <span className="text-4xl font-bold">{timeLeft.minutes}</span>
                <span className="text-sm text-muted-foreground uppercase">Min</span>
            </div>
            <div className="flex flex-col bg-muted/50 p-4 rounded-lg min-w-24">
                <span className="text-4xl font-bold">{timeLeft.seconds}</span>
                <span className="text-sm text-muted-foreground uppercase">Seg</span>
            </div>
        </div>
    );
}
