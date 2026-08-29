"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { areas } from "@/lib/areas-data";
import { siteConfig, whatsappHref } from "@/lib/site-config";

const navLinks = [
  { label: "Sobre", href: "/sobre" },
  { label: "Direito Criminal", href: "/direito-criminal" },
  { label: "Conteúdos", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contato", href: "/contato" },
];

const navClass = "font-body text-[12px] font-medium tracking-[0.08em] uppercase text-ink/75 hover:text-ink transition-colors whitespace-nowrap";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-paper/96 backdrop-blur-md border-b border-hairline-dark shadow-sm" : "bg-paper/90 backdrop-blur-sm"}`}>
      <div className="container-content h-[76px] md:h-[82px] flex items-center">
        <div className="w-full flex items-center justify-between gap-8">
          <Link href="/" className="shrink-0 flex flex-col justify-center leading-none min-w-[220px]" aria-label={siteConfig.firmName}>
            <span className="font-display text-[19px] md:text-[21px] tracking-[-0.02em] text-ink">
              Pereira e Monteiro
            </span>
            <span className="code-label mt-1.5 text-[9px] tracking-[0.16em]">
              ADVOGADOS
            </span>
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-7 xl:gap-9" aria-label="Navegação principal">
            {navLinks.slice(0, 2).map((link) => (
              <Link key={link.href} href={link.href} className={navClass}>{link.label}</Link>
            ))}

            <div className="relative flex items-center h-full" onMouseEnter={() => setAreasOpen(true)} onMouseLeave={() => setAreasOpen(false)}>
              <Link href="/areas" className={navClass}>Áreas de Atuação</Link>
              <div className={`absolute left-1/2 top-[calc(100%+1px)] -translate-x-1/2 w-[520px] pt-4 transition-all duration-200 ${areasOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <div className="bg-noir text-paper p-7 grid grid-cols-2 gap-x-7 gap-y-3 shadow-2xl">
                  {areas.map((area) => (
                    <Link key={area.slug} href={`/areas/${area.slug}`} className="group flex items-baseline gap-2 py-1">
                      <span className="font-mono text-[9px] text-bronze-light">{area.code}</span>
                      <span className="text-[12px] tracking-wide text-paper/80 group-hover:text-bronze-light transition-colors">{area.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.slice(2).map((link) => (
              <Link key={link.href} href={link.href} className={navClass}>{link.label}</Link>
            ))}
          </nav>

          <div className="hidden lg:flex shrink-0 items-center min-w-[220px] justify-end">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary text-[11px] px-5 py-3 whitespace-nowrap">
              Falar com a Advogada
            </a>
          </div>

          <button className="lg:hidden shrink-0 flex flex-col gap-1.5 p-2" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className={`block h-px w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-x-0 top-[76px] bottom-0 bg-paper transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="container-content flex flex-col gap-5 py-8 overflow-y-auto h-full">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-display text-2xl text-ink">{link.label}</Link>
          ))}
          <div className="pt-5 border-t border-hairline-dark">
            <p className="code-label mb-4">Áreas de Atuação</p>
            <div className="grid grid-cols-1 gap-3">
              {areas.map((area) => (
                <Link key={area.slug} href={`/areas/${area.slug}`} onClick={() => setOpen(false)} className="text-ink/80 text-sm">{area.title}</Link>
              ))}
            </div>
          </div>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary mt-2 w-full">Falar com a Advogada</a>
        </div>
      </div>
    </header>
  );
}
