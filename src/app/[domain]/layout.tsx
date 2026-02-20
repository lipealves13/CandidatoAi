import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function TenantLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ domain: string }>;
}) {
    const { domain } = await params;

    // Resolve tenant info
    const tenant = await prisma.tenant.findFirst({
        where: {
            OR: [
                { slug: domain },
                {
                    domains: {
                        some: {
                            domain: domain
                        }
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

    // Inject Theme / Metadata if needed
    return (
        <div className="tenant-wrapper min-h-screen bg-background font-sans antialiased text-foreground">
            {/* We can inject custom CSS variables here based on tenant.campaignData */}
            {children}
        </div>
    );
}
