import Image from "next/image";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Accordion from "@/components/Accordion";
import { areas } from "@/lib/areas-data";
import { criminalTopics } from "@/lib/criminal-data";
import { blogPosts } from "@/lib/blog-data";
import { faqItems } from "@/lib/faq-data";
import { images } from "@/lib/placeholder-images";
import { siteConfig, whatsappHref } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: `${siteConfig.firmNameFull} | Advocacia Estratégica em Direito Criminal`,
  description:
    "Advocacia estratégica com atuação principal em Direito Criminal. Atendimento personalizado, sigiloso e tecnicamente rigoroso, do inquérito ao Tribunal do Júri.",
  path: "/",
});

const diferenciais = [
  {
    code: "I",
    title: "Atendimento personalizado",
    text: "Cada caso recebe análise individual, sem respostas padronizadas ou modelos genéricos de atuação.",
  },
  {
    code: "II",
    title: "Discrição e sigilo",
    text: "Casos criminais exigem confidencialidade absoluta. O sigilo profissional é tratado como princípio inegociável.",
  },
  {
    code: "III",
    title: "Rigor técnico",
    text: "Estratégia jurídica construída sobre estudo aprofundado da legislação, da doutrina e da jurisprudência aplicável.",
  },
  {
    code: "IV",
    title: "Comunicação clara",
    text: "Explicações objetivas sobre cada etapa do processo, sem jargões desnecessários ou promessas de resultado.",
  },
];

const atendimentoSteps = [
  { n: "01", title: "Primeiro contato", text: "Triagem inicial por WhatsApp, telefone ou formulário." },
  { n: "02", title: "Análise inicial do caso", text: "Avaliação técnica preliminar da situação apresentada." },
  { n: "03", title: "Reunião estratégica", text: "Conversa aprofundada para reunir todos os elementos relevantes." },
  { n: "04", title: "Definição da estratégia", text: "Traçado do plano de atuação mais adequado ao caso." },
  { n: "05", title: "Acompanhamento do processo", text: "Condução técnica de cada fase, com atenção a prazos e diligências." },
  { n: "06", title: "Comunicação com o cliente", text: "Atualizações claras sobre o andamento do caso." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] flex items-end overflow-hidden bg-noir">
        <Image
          src={images.heroHome}
          alt="Fachada de tribunal em arquitetura clássica"
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/60 to-noir/10" />
        <div className="container-content relative z-10 pb-20 md:pb-28">
          <Eyebrow code="§ Home" tone="dark">
            Advocacia Criminal &amp; Estratégica
          </Eyebrow>
          <h1 className="mt-6 max-w-3xl font-display text-4xl md:text-6xl lg:text-[68px] leading-[1.08] text-paper text-balance">
            Advocacia estratégica para decisões que{" "}
            <em className="text-bronze-light not-italic font-normal italic">
              exigem experiência
            </em>
            .
          </h1>
          <p className="mt-6 max-w-xl text-paper/70 text-base md:text-lg leading-relaxed">
            Atuação principal em Direito Criminal, com atendimento
            personalizado, sigiloso e tecnicamente rigoroso — do inquérito
            policial ao Tribunal do Júri.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary bg-bronze text-noir hover:bg-bronze-light">
              Falar com a Advogada
            </a>
            <Link href="/direito-criminal" className="btn-on-dark">
              Conheça nossa atuação
            </Link>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="py-24 md:py-32">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative aspect-[4/5] w-full max-w-md">
            <Image
              src={images.aboutPortrait}
              alt={`${siteConfig.lawyerFullName}, advogada`}
              fill
              className="object-cover grayscale-[15%]"
            />
            <div className="absolute -bottom-5 -right-5 hidden md:block bg-noir text-paper px-6 py-4">
              <p className="code-label !text-bronze-light">{siteConfig.oab}</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow code="§ 01">A Advogada</Eyebrow>
            <h2 className="mt-6 font-display text-3xl md:text-[42px] leading-tight text-ink text-balance">
              {siteConfig.lawyerFullName}
            </h2>
            <p className="mt-6 text-mist leading-relaxed max-w-prose">
              Advocacia construída sobre técnica, discrição e proximidade
              real com cada cliente. A atuação prioriza a compreensão
              profunda de cada caso antes de qualquer decisão estratégica,
              com foco especial em Direito Criminal e nas garantias
              fundamentais do processo penal.
            </p>
            <p className="mt-4 text-mist leading-relaxed max-w-prose">
              O atendimento é conduzido de forma direta, sem intermediários,
              e sustentado por estudo constante da legislação, da doutrina e
              da jurisprudência.
            </p>
            <Link href="/sobre" className="link-underline inline-flex items-center gap-2 mt-8 font-body text-sm uppercase tracking-wide text-ink">
              Conheça a trajetória completa →
            </Link>
          </div>
        </div>
      </section>

      {/* ÁREAS DE ATUAÇÃO */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-content">
          <div className="max-w-2xl">
            <Eyebrow code="§ 02">Áreas de Atuação</Eyebrow>
            <h2 className="mt-6 font-display text-3xl md:text-[42px] leading-tight text-ink text-balance">
              Direito Criminal como atuação principal, com suporte jurídico
              completo nas demais áreas.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Link
              href="/direito-criminal"
              className="group relative flex flex-col justify-end p-10 min-h-[320px] bg-noir text-paper overflow-hidden"
            >
              <Image
                src={images.heroCriminal}
                alt="Corredor de tribunal"
                fill
                className="object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700 ease-signature"
              />
              <div className="relative z-10">
                <span className="code-label !text-bronze-light">Atuação principal</span>
                <h3 className="mt-3 font-display text-3xl">Direito Criminal</h3>
                <p className="mt-3 text-paper/70 text-sm max-w-sm">
                  Defesa técnica em todas as fases do processo penal, do
                  inquérito ao Tribunal do Júri.
                </p>
              </div>
            </Link>

            <div className="border border-hairline-dark p-10">
              <span className="code-label">Demais áreas</span>
              <ul className="mt-6 divide-y divide-hairline-dark">
                {areas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/areas/${area.slug}`}
                      className="flex items-center justify-between py-3.5 group"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[10px] text-bronze">{area.code}</span>
                        <span className="text-ink group-hover:text-bronze-dim transition-colors">
                          {area.title}
                        </span>
                      </span>
                      <span className="text-mist-light group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-24 md:py-32">
        <div className="container-content">
          <Eyebrow code="§ 03">Diferenciais</Eyebrow>
          <h2 className="mt-6 font-display text-3xl md:text-[42px] leading-tight text-ink max-w-2xl text-balance">
            O que sustenta uma advocacia criminal consistente.
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {diferenciais.map((item) => (
              <div key={item.code} className="flex gap-6 border-t border-hairline-dark pt-6">
                <span className="font-display italic text-3xl text-bronze/70">{item.code}</span>
                <div>
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-mist text-[15px] leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATUAÇÃO CRIMINAL EM DESTAQUE */}
      <section className="py-24 md:py-32 bg-noir text-paper">
        <div className="container-content">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Eyebrow code="§ 04" tone="dark">Atuação Criminal</Eyebrow>
              <h2 className="mt-6 font-display text-3xl md:text-[42px] leading-tight max-w-xl text-balance">
                Da investigação ao Tribunal do Júri.
              </h2>
            </div>
            <Link href="/direito-criminal" className="link-underline text-sm uppercase tracking-wide text-bronze-light">
              Ver todas as frentes de atuação →
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {criminalTopics.slice(0, 6).map((topic) => (
              <div key={topic.slug} className="border-t border-hairline pt-6">
                <span className="font-mono text-[11px] text-bronze-light">{topic.code}</span>
                <h3 className="mt-2 font-display text-lg">{topic.title}</h3>
                <p className="mt-2 text-paper/60 text-sm leading-relaxed">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA O ATENDIMENTO */}
      <section className="py-24 md:py-32">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <Eyebrow code="§ 05">Atendimento</Eyebrow>
            <h2 className="mt-6 font-display text-3xl leading-tight text-ink text-balance">
              Como funciona o atendimento
            </h2>
            <p className="mt-6 text-mist leading-relaxed">
              Um processo estruturado, do primeiro contato ao acompanhamento
              contínuo do caso.
            </p>
            <Link href="/atendimento" className="link-underline inline-flex items-center gap-2 mt-8 font-body text-sm uppercase tracking-wide text-ink">
              Ver detalhes do atendimento →
            </Link>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {atendimentoSteps.map((step) => (
              <div key={step.n} className="flex gap-5">
                <span className="font-mono text-sm text-bronze pt-1">{step.n}</span>
                <div>
                  <h3 className="font-display text-lg text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-mist text-[14px] leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTEÚDOS */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-content">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Eyebrow code="§ 06">Conteúdos Jurídicos</Eyebrow>
              <h2 className="mt-6 font-display text-3xl md:text-[42px] leading-tight text-ink max-w-xl text-balance">
                Artigos e materiais para compreender melhor o processo penal.
              </h2>
            </div>
            <Link href="/blog" className="link-underline text-sm uppercase tracking-wide text-ink">
              Ver todos os artigos →
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <span className="code-label">{post.category}</span>
                <h3 className="mt-4 font-display text-xl text-ink leading-snug group-hover:text-bronze-dim transition-colors">
                  {post.title}
                </h3>
                <p className="mt-3 text-mist text-sm leading-relaxed">{post.excerpt}</p>
                <p className="mt-4 text-xs text-mist-light">{post.readingTime} de leitura</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="container-content">
          <div className="max-w-2xl">
            <Eyebrow code="§ 07">Perguntas Frequentes</Eyebrow>
            <h2 className="mt-6 font-display text-3xl md:text-[42px] leading-tight text-ink text-balance">
              Dúvidas comuns sobre atuação criminal.
            </h2>
          </div>
          <div className="mt-14 max-w-3xl">
            <Accordion items={faqItems.slice(0, 5)} />
          </div>
          <Link href="/faq" className="link-underline inline-flex items-center gap-2 mt-10 font-body text-sm uppercase tracking-wide text-ink">
            Ver todas as perguntas →
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-28 md:py-36 bg-noir text-paper overflow-hidden">
        <Image
          src={images.cityNight}
          alt="Vista noturna da cidade"
          fill
          className="object-cover opacity-25"
        />
        <div className="container-content relative z-10 text-center">
          <Eyebrow code="§ 08" tone="dark">
            <span className="mx-auto">Fale Conosco</span>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl md:text-5xl leading-tight max-w-2xl mx-auto text-balance">
            Cada caso exige atenção imediata e estratégia própria.
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary bg-bronze text-noir hover:bg-bronze-light">
              Falar com a Advogada
            </a>
            <Link href="/atendimento" className="btn-on-dark">
              Preciso de Orientação Jurídica
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
