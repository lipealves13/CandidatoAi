import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white dark:bg-slate-900 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Candidato.AI</h1>
          <nav>
            <Link href="/dashboard">
              <Button variant="outline">Acessar Painel</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-slate-50 dark:bg-slate-950">
        <h2 className="text-5xl font-extrabold tracking-tight mb-6 max-w-3xl">
          A Plataforma Definitiva para sua Campanha Eleitoral
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          Crie landing pages incríveis em minutos usando Inteligência Artificial. Com total conformidade ao TSE e LGPD.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8">Começar Agora</Button>
          </Link>
        </div>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        &copy; 2026 Candidato.AI - Todos os direitos reservados.
      </footer>
    </div>
  );
}
