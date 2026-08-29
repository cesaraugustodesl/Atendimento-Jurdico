import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import { buildMetadata } from "@/lib/metadata";
import { criminalCluster, getCriminalClusterPage } from "@/lib/criminal-cluster";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export function generateStaticParams() {
  return criminalCluster.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = getCriminalClusterPage(params.slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.description, path: `/atuacao-criminal/${page.slug}` });
}

export default function CriminalClusterPage({ params }: { params: { slug: string } }) {
  const page = getCriminalClusterPage(params.slug);
  if (!page) notFound();

  const related = page.related?.map((slug) => getCriminalClusterPage(slug)).filter(Boolean) ?? [];

  return (
    <>
      <section className="container-content pt-12 pb-8">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Direito Criminal", href: "/direito-criminal" }, { name: page.title, href: `/atuacao-criminal/${page.slug}` }]} />
      </section>

      <section className="container-content pb-20 md:pb-28">
        <Eyebrow code="§ Direito Criminal">Pereira e Monteiro Advogados</Eyebrow>
        <h1 className="mt-6 max-w-4xl font-display text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-ink text-balance">{page.title}</h1>
        <p className="mt-7 max-w-3xl text-mist text-lg leading-relaxed">{page.description}</p>
        <a href={whatsappHref(`Olá, gostaria de orientação sobre ${page.title}.`)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 inline-flex">Falar com a Advogada</a>
      </section>

      <section className="py-16 md:py-24 bg-cream">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <Eyebrow code="§ 01">Visão geral</Eyebrow>
            <p className="mt-6 text-mist leading-relaxed">{page.intro}</p>
          </aside>
          <article className="lg:col-span-8 space-y-12">
            {page.sections.map((section, index) => (
              <section key={section.heading} className="border-t border-hairline-dark pt-6">
                <span className="font-mono text-[10px] text-bronze">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 font-display text-2xl md:text-3xl text-ink">{section.heading}</h2>
                <div className="mt-5 space-y-4">
                  {section.paragraphs.map((paragraph) => <p key={paragraph} className="text-mist leading-relaxed">{paragraph}</p>)}
                </div>
              </section>
            ))}

            <section className="border-t border-hairline-dark pt-6">
              <h2 className="font-display text-2xl md:text-3xl text-ink">Atuação relacionada</h2>
              <ul className="mt-5 divide-y divide-hairline-dark border-t border-hairline-dark">
                {page.bullets.map((item) => <li key={item} className="py-3 text-ink flex gap-3"><span className="text-bronze">—</span>{item}</li>)}
              </ul>
            </section>
          </article>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-content">
          <Eyebrow code="§ 02">Conteúdo relacionado</Eyebrow>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((item) => item && <Link key={item.slug} href={`/atuacao-criminal/${item.slug}`} className="group border-t border-hairline-dark pt-5"><span className="code-label">Direito Criminal</span><h3 className="mt-2 font-display text-xl text-ink group-hover:text-bronze-dim transition-colors">{item.title}</h3><p className="mt-2 text-sm text-mist">{item.description}</p></Link>)}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-noir text-paper">
        <div className="container-content text-center">
          <Eyebrow code="§ Atendimento" tone="dark">São Paulo – SP</Eyebrow>
          <h2 className="mt-6 mx-auto max-w-2xl font-display text-3xl md:text-4xl leading-tight">Precisa compreender os próximos passos do seu caso?</h2>
          <p className="mt-5 mx-auto max-w-xl text-paper/65 leading-relaxed">O atendimento é realizado mediante contato prévio, com análise individual e sigilo profissional.</p>
          <a href={whatsappHref(`Olá, gostaria de falar sobre ${page.title}.`)} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex mt-9 bg-bronze text-noir hover:bg-bronze-light">Solicitar atendimento</a>
        </div>
      </section>
    </>
  );
}
