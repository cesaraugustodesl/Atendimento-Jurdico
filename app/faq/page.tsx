import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import { faqItems } from "@/lib/faq-data";
import { faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { whatsappHref } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Perguntas Frequentes",
  description:
    "Respostas sobre prisão em flagrante, audiência de custódia, habeas corpus, investigação criminal, Tribunal do Júri e sigilo profissional.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqItems)} />

      <section className="container-content pt-12 pb-8">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "FAQ", href: "/faq" }]} />
      </section>

      <section className="container-content pb-16 max-w-2xl">
        <Eyebrow code="§ FAQ">Perguntas Frequentes</Eyebrow>
        <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-ink text-balance">
          Dúvidas comuns sobre atuação criminal e atendimento.
        </h1>
      </section>

      <section className="container-content pb-24 max-w-3xl">
        <Accordion items={faqItems} />

        <div className="mt-14 border border-hairline-dark p-10 text-center">
          <p className="font-display text-xl text-ink mb-4">
            Não encontrou a resposta que procurava?
          </p>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Falar com a Advogada
          </a>
        </div>
      </section>
    </>
  );
}
