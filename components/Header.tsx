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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-signature ${
        scrolled
          ? "bg-paper/95 backdrop-blur border-b border-hairline-dark"
          : "bg-transparent"
      }`}
    >
      <div className="container-content flex items-center justify-between h-20 md:h-24">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-xl md:text-2xl tracking-tight text-ink">
            {siteConfig.firmName}
          </span>
          <span className="code-label mt-1 text-[10px]">Advocacia Criminal</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline font-body text-[13px] tracking-wide uppercase text-ink/80 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setAreasOpen(true)}
            onMouseLeave={() => setAreasOpen(false)}
          >
            <button className="link-underline font-body text-[13px] tracking-wide uppercase text-ink/80 hover:text-ink">
              Áreas de Atuação
            </button>
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[560px] transition-all duration-300 ease-signature ${
                areasOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-noir text-paper p-8 grid grid-cols-2 gap-x-8 gap-y-4 shadow-2xl">
                {areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className="group flex items-baseline gap-2 py-1"
                  >
                    <span className="font-mono text-[10px] text-bronze-light">
                      {area.code}
                    </span>
                    <span className="text-[13px] tracking-wide text-paper/85 group-hover:text-bronze-light transition-colors">
                      {area.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline font-body text-[13px] tracking-wide uppercase text-ink/80 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Falar com a Advogada
          </a>
        </div>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Abrir menu"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`lg:hidden fixed inset-0 top-20 bg-paper transition-transform duration-500 ease-signature ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container-content flex flex-col gap-6 py-10 overflow-y-auto h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-ink"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-hairline-dark">
            <p className="code-label mb-4">Áreas de Atuação</p>
            <div className="grid grid-cols-1 gap-3">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-ink/80 text-sm"
                >
                  {area.title}
                </Link>
              ))}
            </div>
          </div>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 w-full"
          >
            Falar com a Advogada
          </a>
        </div>
      </div>
    </header>
  );
}
