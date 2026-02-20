import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Metadata } from 'next';

const prisma = new PrismaClient();

// Dynamic Metadata example
export async function generateMetadata({
    params,
}: {
    params: Promise<{ domain: string }>;
}): Promise<Metadata> {
    const { domain } = await params;

    const tenant = await prisma.tenant.findFirst({
        where: {
            OR: [
                { slug: domain },
                {
                    domains: {
                        some: { domain: domain }
                    }
                }
            ]
        }
    });

    if (!tenant) {
        return {
            title: "Not Found",
            description: "Page not found.",
        };
    }

    return {
        title: `${tenant.name} | Landing Page`,
        description: `Página oficial da campanha de ${tenant.name}`,
    };
}

export default async function TenantPage({
    params,
}: {
    params: Promise<{ domain: string }>;
}) {
    const { domain } = await params;

    const tenant = await prisma.tenant.findFirst({
        where: {
            OR: [
                { slug: domain },
                {
                    domains: {
                        some: { domain: domain }
                    }
                }
            ]
        },
        include: {
            campaignData: true
        }
    });

    if (!tenant) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 py-8 space-y-16">
                {/* Header Hero */}
                <section className="flex flex-col items-center justify-center p-12 bg-primary text-primary-foreground rounded-xl shadow-2xl text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        {tenant.name}
                    </h1>
                    <p className="text-xl max-w-2xl opacity-90">
                        Juntos por uma cidade mais forte, justa e desenvolvida.
                        Conheça nossas propostas e faça parte da mudança!
                    </p>
                </section>

                {/* Campaign Widgets Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Countdown */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight text-center md:text-left">ACOMPANHE A ELEIÇÃO</h2>
                        <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
                            <ElectionCountdown electionDate="2026-10-04T00:00:00" />
                        </div>
                    </section>

                    {/* Right Column: Lead Capture */}
                    <section>
                        <LeadCaptureForm tenantId={tenant.id} />
                    </section>
                </div>
            </main>

            {/* Mandatory TSE Footer */}
            <LegalFooter
                cnpj={tenant.campaignData?.cnpj || ""}
                partyName={tenant.campaignData?.partyName || ""}
                viceName={tenant.campaignData?.viceName || ""}
            />
        </div>
    );
}
