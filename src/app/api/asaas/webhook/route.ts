import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Asaas Webhook Secret for validation
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN;

export async function POST(req: Request) {
    try {
        const signature = req.headers.get("asaas-access-token");

        // Basic verification of Asaas Webhook Token
        if (ASAAS_WEBHOOK_TOKEN && signature !== ASAAS_WEBHOOK_TOKEN) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const payload = await req.json();

        // Asaas Webhook event types for Subscriptions
        const event = payload.event;
        const subscriptionId = payload.payment?.subscription || payload.subscription?.id;
        const customerId = payload.payment?.customer || payload.customer?.id;

        if (!subscriptionId) {
            return NextResponse.json({ received: true });
        }

        // Logic for successful payment or new subscription
        if (
            event === "PAYMENT_RECEIVED" ||
            event === "PAYMENT_CONFIRMED" ||
            event === "SUBSCRIPTION_CREATED"
        ) {
            await prisma.subscription.updateMany({
                where: { asaasSubscriptionId: subscriptionId },
                data: {
                    status: "ACTIVE",
                    // Ideally calculate currentPeriodEnd based on the charge date + 1 month
                },
            });
        }

        // Logic for failed payment or canceled subscription
        if (
            event === "PAYMENT_OVERDUE" ||
            event === "SUBSCRIPTION_DELETED"
        ) {
            await prisma.subscription.updateMany({
                where: { asaasSubscriptionId: subscriptionId },
                data: {
                    status: "INACTIVE",
                },
            });
            // TODO: Disconnect custom domains via Vercel API if inactive
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Asaas Webhook Error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed." },
            { status: 400 }
        );
    }
}
