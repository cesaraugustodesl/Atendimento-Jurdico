import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { attorneySchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { images } from "@/lib/placeholder-images";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Sobre a Advogada",
  description:
    "Conheça a trajetória, a formação e a filosofia de atuação da advogada por trás do escritório: atendimento estratégico, técnico e sigiloso.",
  path: "/sobre",
});

const formacao = [
  "PREENCHER: Graduação em Direito — instituição e ano",
  "PREENCHER: Pós-graduação / especialização em Direito Penal e Processual Penal",
  "PREENCHER: Cursos de extensão e atualização profissional relevantes",
];

const valores = [
  {
    title: "Sigilo",
    text: "Cada informação compartilhada é tratada com absoluta confidencialidade, do primeiro contato ao encerramento do caso.",
  },
  {
    title: "Técnica",
    text: "Estudo contínuo da legislação, doutrina e jurisprudência como base de toda decisão estratégica.",
  },
  {
    title: "Proximidade",
    text: "Atendimento direto, sem intermediários, com comunicação clara sobre cada etapa do processo.",
  },
  {
    title: "Responsabilidade",
    text: "Compromisso com a ética profissional e com a defesa técnica, sem promessas de resultado.",
  },
];

export default function SobrePage() {
  return (
    <>
      <JsonLd data={attorneySchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: siteConfig.siteUrl },
          { name: "Sobre", url: `${siteConfig.siteUrl}/sobre` },
        ])}
      />

      <section className="container-content pt-12 pb-8">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Sobre", href: "/sobre" }]} />
      </section>

      {/* HERO SOBRE */}
      <section className="container-content pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <Eyebrow code="§ Sobre">A Advogada</Eyebrow>
          <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.1] text-ink text-balance">
            {siteConfig.lawyerFullName}
          </h1>
          <p className="mt-6 text-mist text-lg leading-relaxed max-w-xl">
            Advocacia estratégica, técnica e discreta, com atuação principal
            em Direito Criminal e compromisso com o atendimento
            personalizado de cada cliente.
          </p>
        </div>
        <div className="lg:col-span-5 relative aspect-[3/4] w-full">
          <Image src={images.aboutPortrait} alt={siteConfig.lawyerFullName} fill className="object-cover" />
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <Eyebrow code="§ 01">Trajetória</Eyebrow>
            <h2 className="mt-6 font-display text-3xl text-ink text-balance">
              História e formação
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 max-w-prose">
            <p className="text-mist leading-relaxed">
              A trajetória profissional é marcada pela dedicação ao Direito
              Penal e Processual Penal, com atuação construída sobre estudo
              constante, atenção aos detalhes e compromisso com a defesa
              técnica de cada cliente.
            </p>
            <p className="text-mist leading-relaxed">
              PREENCHER: parágrafo com a história real da advogada — origem
              profissional, motivação pela área criminal, principais marcos
              da carreira e forma de atuação construída ao longo dos anos.
            </p>
            <div className="pt-4">
              <p className="code-label mb-4">Formação acadêmica</p>
              <ul className="space-y-2">
                {formacao.map((item) => (
                  <li key={item} className="text-mist text-sm border-l-2 border-bronze/40 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-mist-light pt-4">{siteConfig.oab}</p>
          </div>
        </div>
      </section>

      {/* VALORES E FILOSOFIA */}
      <section className="py-20 md:py-28">
        <div className="container-content">
          <Eyebrow code="§ 02">Filosofia de Atuação</Eyebrow>
          <h2 className="mt-6 font-display text-3xl md:text-[42px] text-ink max-w-2xl text-balance">
            Atendimento personalizado, estratégico e sigiloso.
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {valores.map((valor, i) => (
              <div key={valor.title} className="border-t border-hairline-dark pt-6">
                <span className="font-mono text-xs text-bronze">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl text-ink">{valor.title}</h3>
                <p className="mt-2 text-mist text-sm leading-relaxed">{valor.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-noir text-paper text-center">
        <div className="container-content">
          <h2 className="font-display text-3xl md:text-4xl max-w-xl mx-auto text-balance">
            Converse diretamente com a advogada sobre o seu caso.
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary bg-bronze text-noir hover:bg-bronze-light">
              Falar com a Advogada
            </a>
            <Link href="/contato" className="btn-on-dark">
              Ir para Contato
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
