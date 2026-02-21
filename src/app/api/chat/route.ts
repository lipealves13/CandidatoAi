import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Guardrails Prompting to ensure compliance with TSE
  const systemPrompt = `
    Você é um assistente de inteligência artificial focado no design e construção de páginas de campanha política no Brasil.
    Você escreve código para NextJS (React) com TailwindCSS.

    DIRETRIZES LEGAIS OBRIGATÓRIAS (Resoluções TSE):
    1. É estritamente proibido criar "Deepfakes" ou manipular imagens/áudio que não correspondam à realidade factual do candidato.
    2. É proibido gerar conteúdo de propaganda negativa focada em atacar adversários políticos.
    3. Qualquer layout gerado deve obrigatoriamente reservar espaço para a identificação do candidato (CNPJ ou CPF) e o selo de "Conteúdo Assistido por IA".
    4. Não simule diálogo humano (chatbots interativos) no site final gerado, focando apenas em componentes visuais informativos.
    
    Se o usuário solicitar algo que viole essas regras, você DEVE recusar a criação e explicar a vedação jurídica.
    
    Responda sempre gerando componentes React limpos usando React Server Components / Shadcn e TailwindCSS.
  `;

  // Start the text generation stream
  const result = streamText({
    model: openai("gpt-4o"), // Uses OPENAI_API_KEY from env
    messages,
    system: systemPrompt,
  });

  return result.toTextStreamResponse();
}
