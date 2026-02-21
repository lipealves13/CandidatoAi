import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
    // For the MVP, we fetch the first tenant from the database.
    // If none exists, we create a default demo tenant to avoid Foreign Key constraint errors.
    let tenant = await prisma.tenant.findFirst();

    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: "Candidato Demo",
                slug: "demo",
            }
        });
    }

    const tenantId = tenant.id;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            {/* Dashboard Navigation */}
            <header className="border-b bg-white dark:bg-slate-900 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="font-bold text-lg">Candidato.AI Workspace</h1>
                    <div className="text-sm text-slate-500">
                        Dashboard Administrativo
                    </div>
                </div>
            </header>

            {/* Main Dashboard Panel Component */}
            <main className="py-8">
                <DashboardPanel tenantId={tenantId} />
            </main>
        </div>
    );
}
