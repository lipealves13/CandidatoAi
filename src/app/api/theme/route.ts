import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { tenantId, themeColor, fontHeading, fontBody } = await req.json();

        if (!tenantId) {
            return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 });
        }

        const updatedData = await prisma.campaignData.upsert({
            where: {
                tenantId: tenantId,
            },
            update: {
                themeColor,
                fontHeading,
                fontBody,
            },
            create: {
                tenantId,
                themeColor,
                fontHeading,
                fontBody,
            },
        });

        return NextResponse.json({ success: true, data: updatedData });
    } catch (error) {
        console.error("Theme Error:", error);
        return NextResponse.json({ error: "Failed to save theme configuration." }, { status: 500 });
    }
}
