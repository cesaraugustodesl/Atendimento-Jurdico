import Link from "next/link";
import { areas } from "@/lib/areas-data";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-noir text-paper/70">
      <div className="container-content py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <p className="font-display text-2xl text-paper">{siteConfig.firmName}</p>
          <p className="code-label mt-2">Advocacia Criminal</p>
          <p className="mt-6 text-sm leading-relaxed text-paper/60 max-w-xs">
            Advocacia estratégica para decisões que exigem experiência,
            discrição e domínio técnico.
          </p>
          <p className="mt-6 text-xs text-paper/40">{siteConfig.oab}</p>
        </div>

        <div>
          <p className="code-label mb-5">Institucional</p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/sobre" className="hover:text-bronze-light transition-colors">Sobre a Advogada</Link></li>
            <li><Link href="/direito-criminal" className="hover:text-bronze-light transition-colors">Direito Criminal</Link></li>
            <li><Link href="/atendimento" className="hover:text-bronze-light transition-colors">Como Funciona o Atendimento</Link></li>
            <li><Link href="/blog" className="hover:text-bronze-light transition-colors">Conteúdos Jurídicos</Link></li>
            <li><Link href="/faq" className="hover:text-bronze-light transition-colors">Perguntas Frequentes</Link></li>
            <li><Link href="/contato" className="hover:text-bronze-light transition-colors">Contato</Link></li>
          </ul>
        </div>

        <div>
          <p className="code-label mb-5">Áreas de Atuação</p>
          <ul className="space-y-3 text-sm">
            {areas.slice(0, 6).map((area) => (
              <li key={area.slug}>
                <Link href={`/areas/${area.slug}`} className="hover:text-bronze-light transition-colors">
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="code-label mb-5">Contato</p>
          <ul className="space-y-3 text-sm text-paper/60">
            <li>{siteConfig.phoneDisplay}</li>
            <li>{siteConfig.email}</li>
            <li>{siteConfig.address.line1}</li>
            <li>{siteConfig.address.line2}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-content py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-paper/40">
          <p>
            © {new Date().getFullYear()} {siteConfig.firmNameFull}. Todos os
            direitos reservados.
          </p>
          <p>{siteConfig.oab}</p>
        </div>
      </div>
    </footer>
  );
}
