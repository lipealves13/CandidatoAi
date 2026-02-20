import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

export async function POST(req: Request) {
    try {
        const { domain, tenantId } = await req.json();

        if (!domain || !tenantId) {
            return NextResponse.json({ error: "Missing domain or tenantId" }, { status: 400 });
        }

        // Verify tenant exists and has an active subscription
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            include: { subscription: true }
        });

        if (!tenant) {
            return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
        }

        if (tenant.subscription?.status !== "ACTIVE") {
            return NextResponse.json({ error: "Active subscription required for custom domains" }, { status: 403 });
        }

        // 1. Add Domain to Vercel Project
        let url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`;
        if (VERCEL_TEAM_ID) url += `?teamId=${VERCEL_TEAM_ID}`;

        const vercelRes = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${VERCEL_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: domain }),
        });

        const vercelData = await vercelRes.json();

        if (!vercelRes.ok) {
            return NextResponse.json({ error: vercelData.error?.message || "Vercel API error" }, { status: vercelRes.status });
        }

        // 2. Save domain to Prisma Database
        await prisma.domain.create({
            data: {
                domain: domain,
                tenantId: tenant.id,
                isVerified: false, // Wait for DNS propagation
            }
        });

        return NextResponse.json({
            success: true,
            domain: domain,
            message: "Domain added to Vercel. Please configure DNS settings."
        });

    } catch (error) {
        console.error("Domain Add Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
