export function LegalFooter({
    cnpj,
    partyName,
    viceName
}: {
    cnpj?: string;
    partyName?: string;
    viceName?: string;
}) {
    return (
        <footer className="w-full bg-slate-900 text-slate-400 py-8 px-4 mt-auto border-t border-slate-800">
            <div className="container mx-auto flex flex-col items-center justify-center text-center max-w-4xl space-y-4">

                <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    — Informações Legais Obrigatórias —
                </div>

                <div className="text-sm space-y-2">
                    {partyName && (
                        <p>
                            <strong className="text-slate-300">Partido / Coligação:</strong> {partyName}
                        </p>
                    )}
                    {viceName && (
                        <p>
                            <strong className="text-slate-300">Candidato a Vice:</strong> {viceName}
                        </p>
                    )}
                    <p>
                        <strong className="text-slate-300">CNPJ do Responsável/Contratante:</strong> {cnpj || "Não informado"}
                    </p>
                </div>

                <div className="mt-8 p-4 bg-slate-800/50 rounded flex flex-col sm:flex-row items-center gap-4 text-xs border border-slate-700/50">
                    <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-[10px] font-bold tracking-wider">
                        TRANSPARÊNCIA IA
                    </span>
                    <p className="text-left">
                        Partes do código visual desta página foram geradas com o auxílio de
                        Inteligência Artificial (IA) através da plataforma Candidato.AI, em
                        estrita observância à Resolução do TSE, garantindo que não há uso
                        de Deepfakes ou desinformação.
                    </p>
                </div>

                <div className="text-xs mt-4 flex gap-4">
                    <a href="#privacidade" className="hover:text-white transition-colors underline underline-offset-4">
                        Política de Privacidade & LGPD (DPO)
                    </a>
                </div>
            </div>
        </footer>
    );
}
