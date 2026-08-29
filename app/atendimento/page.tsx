import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/metadata";
import { whatsappHref } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Atendimento",
  description:
    "Entenda como funciona o atendimento, do primeiro contato ao acompanhamento contínuo do processo, e solicite orientação jurídica.",
  path: "/atendimento",
});

const steps = [
  {
    n: "01",
    title: "Primeiro contato",
    text: "O contato inicial pode ser feito por WhatsApp, telefone, e-mail ou pelo formulário abaixo. Nessa etapa, é feita uma triagem breve para entender a natureza da demanda.",
  },
  {
    n: "02",
    title: "Análise inicial do caso",
    text: "Os elementos apresentados são analisados tecnicamente para identificar a área do direito envolvida e o grau de urgência do caso.",
  },
  {
    n: "03",
    title: "Reunião estratégica",
    text: "Uma conversa mais aprofundada é agendada para reunir todos os documentos e informações relevantes, presencialmente ou remotamente.",
  },
  {
    n: "04",
    title: "Definição da estratégia jurídica",
    text: "Com base nas informações reunidas, é definida a linha de atuação mais adequada, sempre explicada de forma clara ao cliente.",
  },
  {
    n: "05",
    title: "Acompanhamento do processo",
    text: "O andamento do caso é acompanhado de perto, com atenção a prazos, diligências e decisões relevantes em cada fase.",
  },
  {
    n: "06",
    title: "Comunicação com o cliente",
    text: "Atualizações são compartilhadas ao longo do processo, evitando períodos longos sem retorno sobre o andamento do caso.",
  },
];

export default function AtendimentoPage() {
  return (
    <>
      <section className="container-content pt-12 pb-8">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Atendimento", href: "/atendimento" }]} />
      </section>

      <section className="container-content pb-20 md:pb-28 max-w-2xl">
        <Eyebrow code="§ Atendimento">Como Funciona</Eyebrow>
        <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-ink text-balance">
          Um processo estruturado, do primeiro contato ao acompanhamento do
          caso.
        </h1>
        <p className="mt-6 text-mist text-lg leading-relaxed">
          Cada etapa é conduzida com clareza, para que o cliente entenda
          exatamente o que está acontecendo em seu caso.
        </p>
      </section>

      <section className="py-16 md:py-24 bg-cream">
        <div className="container-content grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-14">
          {steps.map((step) => (
            <div key={step.n} className="border-t border-hairline-dark pt-6">
              <span className="font-mono text-sm text-bronze">{step.n}</span>
              <h2 className="mt-3 font-display text-2xl text-ink">{step.title}</h2>
              <p className="mt-3 text-mist leading-relaxed max-w-md">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-content max-w-3xl">
          <Eyebrow code="§ Formulário">Solicitar Atendimento</Eyebrow>
          <h2 className="mt-6 font-display text-3xl text-ink text-balance">
            Preencha os dados abaixo para iniciarmos a análise do seu caso.
          </h2>
          <p className="mt-4 text-mist text-sm">
            Para situações urgentes, como prisão em flagrante, prefira o{" "}
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="text-bronze underline">
              atendimento direto via WhatsApp
            </a>
            .
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
