import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import { areas } from "@/lib/areas-data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Áreas de Atuação",
  description:
    "Conheça todas as áreas de atuação do escritório: Direito Criminal, Família, Civil, Empresarial, Trabalhista, Previdenciário, Imobiliário, Consumidor, Contratual, LGPD e Consultoria Preventiva.",
  path: "/areas",
});

export default function AreasIndexPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-content">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Áreas de Atuação", href: "/areas" }]} />

        <div className="mt-10 max-w-2xl">
          <Eyebrow code="§ Áreas">Áreas de Atuação</Eyebrow>
          <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-ink text-balance">
            Suporte jurídico completo, com atuação principal em Direito
            Criminal.
          </h1>
        </div>

        <div className="mt-16">
          <Link
            href="/direito-criminal"
            className="flex items-center justify-between py-6 border-t border-b border-hairline-dark group"
          >
            <span className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-bronze">Área principal</span>
              <span className="font-display text-2xl text-ink group-hover:text-bronze-dim transition-colors">
                Direito Criminal
              </span>
            </span>
            <span className="text-mist-light group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="flex items-center justify-between py-6 border-b border-hairline-dark group"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-bronze">{area.code}</span>
                <span className="font-display text-2xl text-ink group-hover:text-bronze-dim transition-colors">
                  {area.title}
                </span>
              </span>
              <span className="text-mist-light group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
