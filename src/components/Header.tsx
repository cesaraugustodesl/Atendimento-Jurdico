import { Menu, MessageCircle, Scale, X } from "lucide-react";
import { useState } from "react";
import RouteLink from "./RouteLink";
import { pagePaths, primaryNav, type Page, siteConfig } from "../config/site";

interface HeaderProps { currentPage?: Page; onNavigate: (href: string) => void; }

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const go = (href: string) => { onNavigate(href); close(); };
  return (
    <header className="site-header">
      <nav className="container-custom header-inner">
        <RouteLink href="/" onNavigate={onNavigate} className="brand">
          <span className="brand-mark"><Scale /></span>
          <span><strong>PEREIRA E MONTEIRO</strong><small>ADVOGADOS</small></span>
        </RouteLink>
        <div className="desktop-nav">
          {primaryNav.slice(1).map(item => <RouteLink key={item.id} href={item.href} onNavigate={onNavigate} className={currentPage === item.id ? "active" : ""}>{item.label}</RouteLink>)}
        </div>
        <RouteLink href={pagePaths.contact} onNavigate={onNavigate} className="header-cta">Falar com a Advogada <MessageCircle /></RouteLink>
        <button className="mobile-toggle" onClick={() => setOpen(v => !v)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        {open && <div className="mobile-nav">
          {primaryNav.slice(1).map(item => <RouteLink key={item.id} href={item.href} onNavigate={go} className="mobile-link">{item.label}</RouteLink>)}
          <RouteLink href={pagePaths.contact} onNavigate={go} className="btn-gold">Falar com a Advogada</RouteLink>
        </div>}
      </nav>
    </header>
  );
}
