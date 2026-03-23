import { Mail, MapPin, Phone, Scale } from "lucide-react";
import RouteLink from "./RouteLink";
import { primaryNav, siteConfig, pagePaths } from "../config/site";

interface FooterProps {
  onNavigate: (href: string) => void;
}

const footerContentLinks = [
  { href: "/advogado-trabalhista-em-sao-paulo", label: "Advogado trabalhista em Sao Paulo" },
  { href: "/fgts-nao-depositado", label: "FGTS nao depositado" },
  { href: "/golpe-via-pix-banco-nao-devolveu", label: "Golpe via PIX" },
  { href: "/pensao-guarda-divorcio", label: "Pensao, guarda e divorcio" },
];

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="container-custom py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-lg shadow-sky-900/40">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Atendimento Juridico
                </p>
                <p className="text-xl font-serif font-bold text-white">
                  Inteligente
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-400">
              Triagem juridica inicial para quem precisa entender o caso, reunir
              documentos e decidir entre chat, simulacao, conteudo e consulta humana.
            </p>
          </div>

          <div>
            <h3 className="footer-title">Navegacao</h3>
            <ul className="space-y-3 text-sm">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <RouteLink href={item.href} onNavigate={onNavigate} className="footer-link">
                    {item.label}
                  </RouteLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Conteudo</h3>
            <ul className="space-y-3 text-sm">
              {footerContentLinks.map((item) => (
                <li key={item.href}>
                  <RouteLink href={item.href} onNavigate={onNavigate} className="footer-link">
                    {item.label}
                  </RouteLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Contato</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-sky-400" />
                <span>
                  {siteConfig.contact.addressLine1}
                  <br />
                  {siteConfig.contact.addressLine2}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="text-slate-500">{siteConfig.contact.registry}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-400">
          <RouteLink href={pagePaths.terms} onNavigate={onNavigate} className="footer-link">
            Termos de uso
          </RouteLink>
          <RouteLink href={pagePaths.privacy} onNavigate={onNavigate} className="footer-link">
            Politica de privacidade
          </RouteLink>
          <RouteLink href={pagePaths.blog} onNavigate={onNavigate} className="footer-link">
            Blog juridico
          </RouteLink>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {currentYear} {siteConfig.brand.name}. Todos os direitos reservados.
          </p>
          <p>Este site fornece orientacao inicial e nao substitui consulta juridica formal.</p>
          <p className="hidden md:block">{siteConfig.contact.registry}</p>
        </div>
      </div>
    </footer>
  );
}
