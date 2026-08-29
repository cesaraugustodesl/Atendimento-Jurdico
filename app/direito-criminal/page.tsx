import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { criminalTopics } from "@/lib/criminal-data";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { images } from "@/lib/placeholder-images";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Direito Criminal",
  description:
    "Defesa criminal técnica e estratégica: inquérito policial, prisão em flagrante, audiência de custódia, habeas corpus, Tribunal do Júri e demais frentes do processo penal.",
  path: "/direito-criminal",
});

export default function DireitoCriminalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: siteConfig.siteUrl },
          { name: "Direito Criminal", url: `${siteConfig.siteUrl}/direito-criminal` },
        ])}
      />

      {/* HERO */}
      <section className="relative bg-noir text-paper overflow-hidden">
        <Image
          src={images.heroCriminal}
          alt="Corredor de tribunal criminal"
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/70 to-noir/40" />
        <div className="container-content relative z-10 pt-10 pb-24 md:pb-32">
          <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Direito Criminal", href: "/direito-criminal" }]} />
          <div className="mt-10">
            <Eyebrow code="§ Área Principal" tone="dark">Direito Criminal</Eyebrow>
            <h1 className="mt-6 max-w-2xl font-display text-4xl md:text-6xl leading-[1.08] text-balance">
              Defesa técnica em cada fase do processo penal.
            </h1>
            <p className="mt-6 max-w-xl text-paper/70 text-base md:text-lg leading-relaxed">
              Atuação estratégica desde a investigação preliminar até o
              trânsito em julgado, com atendimento sigiloso e resposta ágil
              em situações de urgência.
            </p>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary bg-bronze text-noir hover:bg-bronze-light mt-10">
              Falar com a Advogada
            </a>
          </div>
        </div>
      </section>

      {/* INTRODUÇÃO */}
      <section className="py-20 md:py-28">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <Eyebrow code="§ 00">Atuação</Eyebrow>
            <h2 className="mt-6 font-display text-3xl text-ink text-balance">
              Uma defesa construída caso a caso
            </h2>
          </div>
          <div className="lg:col-span-8 max-w-prose space-y-5">
            <p className="text-mist leading-relaxed">
              O Direito Criminal exige rapidez de resposta, domínio técnico e
              atenção rigorosa a prazos processuais. A atuação abrange desde
              o acompanhamento de investigações em curso até a defesa em
              julgamento, incluindo processos de competência do Tribunal do
              Júri.
            </p>
            <p className="text-mist leading-relaxed">
              Cada estratégia é construída a partir da análise individual do
              caso, sem uso de modelos padronizados. Não há promessa de
              resultado — há compromisso técnico com a melhor defesa
              possível dentro do que a lei permite.
            </p>
          </div>
        </div>
      </section>

      {/* GRID DE TÓPICOS — 18 FRENTES DE ATUAÇÃO */}
      <section id="frentes-de-atuacao" className="py-20 md:py-28 bg-cream">
        <div className="container-content">
          <Eyebrow code="§ 01">Frentes de Atuação</Eyebrow>
          <h2 className="mt-6 font-display text-3xl md:text-[42px] text-ink max-w-2xl text-balance">
            Do inquérito ao Tribunal do Júri
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {criminalTopics.map((topic) => (
              <div key={topic.slug} id={topic.slug} className="border-t border-hairline-dark pt-6 scroll-mt-28">
                <span className="font-mono text-[11px] text-bronze">{topic.code}</span>
                <h3 className="mt-3 font-display text-xl text-ink">{topic.title}</h3>
                <p className="mt-3 text-mist text-sm leading-relaxed">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGÊNCIA */}
      <section className="py-20 md:py-28">
        <div className="container-content grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow code="§ 02">Atendimento de Urgência</Eyebrow>
            <h2 className="mt-6 font-display text-3xl text-ink text-balance">
              Prisão em flagrante ou audiência de custódia iminente?
            </h2>
            <p className="mt-6 text-mist leading-relaxed max-w-md">
              Situações de urgência exigem contato imediato. Utilize o
              WhatsApp para uma triagem rápida da sua situação.
            </p>
            <a href={whatsappHref("Preciso de atendimento urgente em uma questão criminal.")} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-8">
              Atendimento Urgente pelo WhatsApp
            </a>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image src={images.courtroomInterior} alt="Interior de sala de tribunal" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28 bg-noir text-paper text-center">
        <div className="container-content">
          <h2 className="font-display text-3xl md:text-4xl max-w-xl mx-auto text-balance">
            Fale com a advogada sobre a sua situação.
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary bg-bronze text-noir hover:bg-bronze-light">
              Falar com a Advogada
            </a>
            <Link href="/atendimento" className="btn-on-dark">
              Entender o Atendimento
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
