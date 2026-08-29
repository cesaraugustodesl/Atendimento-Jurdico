import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { areas, getAreaBySlug } from "@/lib/areas-data";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { images } from "@/lib/placeholder-images";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const area = getAreaBySlug(params.slug);
  if (!area) return {};
  return buildMetadata({
    title: area.title,
    description: area.metaDescription,
    path: `/areas/${area.slug}`,
  });
}

export default function AreaPage({ params }: { params: { slug: string } }) {
  const area = getAreaBySlug(params.slug);
  if (!area) notFound();

  const others = areas.filter((a) => a.slug !== area.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: siteConfig.siteUrl },
          { name: "Áreas de Atuação", url: `${siteConfig.siteUrl}/areas` },
          { name: area.title, url: `${siteConfig.siteUrl}/areas/${area.slug}` },
        ])}
      />

      <section className="container-content pt-12 pb-8">
        <Breadcrumbs
          items={[
            { name: "Início", href: "/" },
            { name: "Áreas de Atuação", href: "/areas" },
            { name: area.title, href: `/areas/${area.slug}` },
          ]}
        />
      </section>

      <section className="container-content pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <Eyebrow code={area.code}>Área de Atuação</Eyebrow>
          <h1 className="mt-6 font-display text-4xl md:text-5xl leading-[1.1] text-ink text-balance">
            {area.title}
          </h1>
          <p className="mt-6 text-mist text-lg leading-relaxed max-w-xl">
            {area.shortDescription}
          </p>
        </div>
        <div className="lg:col-span-5 relative aspect-[4/3] w-full">
          <Image src={images.businessMeeting} alt={area.title} fill className="object-cover" />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <Eyebrow code="§ 01">Como atuamos</Eyebrow>
            <p className="mt-6 text-mist leading-relaxed max-w-prose">{area.intro}</p>
            <a
              href={whatsappHref(`Olá, gostaria de falar sobre um caso de ${area.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8"
            >
              Solicitar Atendimento
            </a>
          </div>
          <div className="lg:col-span-7">
            <p className="code-label mb-6">Atuação inclui</p>
            <ul className="divide-y divide-hairline-dark border-t border-hairline-dark">
              {area.atuacao.map((item) => (
                <li key={item} className="py-4 text-ink flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-bronze">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-content">
          <Eyebrow code="§ 02">Outras Áreas</Eyebrow>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {others.map((other) => (
              <Link key={other.slug} href={`/areas/${other.slug}`} className="group border-t border-hairline-dark pt-5">
                <span className="font-mono text-[10px] text-bronze">{other.code}</span>
                <h3 className="mt-2 font-display text-lg text-ink group-hover:text-bronze-dim transition-colors">
                  {other.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
