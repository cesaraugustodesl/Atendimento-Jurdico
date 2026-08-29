import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { criminalCluster, getCriminalClusterPage } from "@/lib/criminal-cluster";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export function generateStaticParams() {
  return criminalCluster.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = getCriminalClusterPage(params.slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.description, path: `/criminal/${page.slug}` });
}

export default function CriminalClusterPage({ params }: { params: { slug: string } }) {
  const page = getCriminalClusterPage(params.slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: siteConfig.siteUrl },
        { name: "Direito Criminal", url: `${siteConfig.siteUrl}/direito-criminal` },
        { name: page.title, url: `${siteConfig.siteUrl}/criminal/${page.slug}` },
      ])} />

      <section className="container-content pt-12 pb-8">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Direito Criminal", href: "/direito-criminal" }, { name: page.title, href: `/criminal/${page.slug}` }]} />
      </section>

      <section className="container-content pb-20 md:pb-28">
        <div className="max-w-4xl">
          <Eyebrow code="§ Direito Criminal">Pereira e Monteiro Advogados</Eyebrow>
          <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.08] text-ink text-balance">{page.title}</h1>
          <p className="mt-7 max-w-2xl text-mist text-lg leading-relaxed">{page.intro}</p>
          <a href={whatsappHref(`Olá, gostaria de falar sobre ${page.title}.`)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">Falar com a Advogada</a>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <Eyebrow code="§ 01">Atuação</Eyebrow>
            <ul className="mt-6 border-t border-hairline-dark divide-y divide-hairline-dark">
              {page.bullets.map((item) => <li key={item} className="py-4 flex gap-3 text-ink"><span className="font-mono text-[10px] text-bronze">—</span>{item}</li>)}
            </ul>
          </div>
          <div className="lg:col-span-7 space-y-12">
            {page.sections.map((section, index) => (
              <article key={section.heading}>
                <p className="code-label mb-3">§ {String(index + 2).padStart(2, "0")}</p>
                <h2 className="font-display text-2xl md:text-3xl text-ink">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-mist leading-relaxed">{paragraph}</p>)}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-content">
          <Eyebrow code="§ Próximo passo">Atendimento</Eyebrow>
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="font-display text-3xl md:text-4xl max-w-2xl text-ink">Entenda o seu caso antes de tomar decisões jurídicas.</h2>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">Solicitar Atendimento</a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-content">
          <Eyebrow code="§ Conteúdo relacionado">Direito Criminal</Eyebrow>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {criminalCluster.filter((item) => item.slug !== page.slug).slice(0, 4).map((item) => <Link key={item.slug} href={`/criminal/${item.slug}`} className="border-t border-hairline-dark pt-4 group"><h3 className="font-display text-lg text-ink group-hover:text-bronze-dim transition-colors">{item.title}</h3><span className="mt-2 block text-xs text-mist">Saiba mais →</span></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
