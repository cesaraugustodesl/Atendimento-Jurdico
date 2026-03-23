import { AlertTriangle, FileText, Scale } from "lucide-react";
import { siteConfig } from "../config/site";

const sections = [
  {
    title: "1. Natureza do servico",
    paragraphs: [
      "O site oferece triagem juridica inicial com apoio de inteligencia artificial. O conteudo possui carater informativo e educacional.",
      "As respostas nao constituem consultoria juridica formal, nao criam relacao advogado-cliente e nao substituem a analise profissional de um caso concreto.",
    ],
  },
  {
    title: "2. Limites de responsabilidade",
    paragraphs: [
      "A plataforma organiza informacoes, aponta proximos passos e ajuda a preparar o contato. Ela nao promete resultado, ganho de causa ou desfecho especifico.",
      "Decisoes juridicas relevantes devem ser tomadas apenas apos validacao com advogado habilitado.",
    ],
  },
  {
    title: "3. Uso adequado",
    paragraphs: [
      "Ao utilizar o site, voce declara que fornecera informacoes verdadeiras e que nao usara o servico para fins ilicitos, abusivos ou para expor dados de terceiros sem autorizacao.",
      "Tambem se compromete a nao tentar contornar mecanismos de seguranca ou explorar tecnicamente a plataforma.",
    ],
  },
  {
    title: "4. Casos urgentes",
    paragraphs: [
      "Em situacoes de violencia, risco a saude, ameacas, prazos processuais ou emergencias, o usuario deve procurar atendimento humano imediato.",
      "Nesses cenarios, o site deve ser usado apenas como apoio complementar, nunca como unica fonte de decisao.",
    ],
  },
  {
    title: "5. Propriedade intelectual",
    paragraphs: [
      "Estrutura visual, textos, marcas, fluxos e codigo da plataforma sao protegidos e nao podem ser reproduzidos ou explorados comercialmente sem autorizacao.",
    ],
  },
  {
    title: "6. Disponibilidade",
    paragraphs: [
      "O servico pode passar por manutencao, ajuste de conteudo ou indisponibilidade tecnica sem aviso previo.",
      "Nao ha garantia de funcionamento ininterrupto.",
    ],
  },
  {
    title: "7. Atualizacoes",
    paragraphs: [
      "Os termos podem ser revisados para refletir mudancas operacionais, legais ou tecnicas. A versao publicada nesta pagina e a que prevalece.",
    ],
  },
];

export default function Terms() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-4xl">
            <span className="eyebrow">documento legal</span>
            <h1 className="mt-6">Termos de uso da plataforma</h1>
            <p className="mt-6 max-w-2xl text-lg">
              Estes termos definem o escopo do site, o limite da triagem por IA
              e a necessidade de validacao humana para tomada de decisao.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-6">
              <div className="surface-card p-7">
                <div className="inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">Leitura rapida</h2>
                <p className="mt-4 text-sm leading-7">
                  Use a plataforma para triagem, organizacao e preparacao do
                  contato. Nao use a plataforma como substituta integral de
                  consulta juridica formal.
                </p>
              </div>

              <div className="surface-panel p-7">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-300" />
                  <div>
                    <p className="text-sm font-semibold text-amber-200">
                      Situacoes urgentes
                    </p>
                    <p className="mt-2 text-sm leading-7">
                      Se houver urgencia material ou processual, procure contato
                      humano imediatamente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-7">
                <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-sky-400" />
                  <p className="text-sm text-slate-300">
                    Ultima atualizacao: marco de 2026
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7">
                  Contato institucional: {siteConfig.contact.email}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {sections.map((section) => (
                <div key={section.title} className="surface-panel p-7">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
