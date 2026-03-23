import { Menu, MessageSquare, Scale, X } from "lucide-react";
import { useState } from "react";
import { type Page, primaryNav } from "../config/site";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-2xl">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => handleNavigation("home")}
            className="flex items-center gap-3 text-white hover:text-sky-300 transition-colors"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-lg shadow-sky-900/40">
              <Scale className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm md:text-base font-semibold tracking-wide uppercase text-slate-300">
                Atendimento Juridico
              </span>
              <span className="text-base md:text-lg font-serif font-bold">
                Inteligente
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-7">
            {primaryNav.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavigation("contact")}
              className="btn-secondary text-sm px-4 py-2.5 min-h-0"
            >
              Agendar analise
            </button>
            <button
              onClick={() => handleNavigation("chat")}
              className="btn-primary text-sm px-4 py-2.5 min-h-0 inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Comecar pelo chat
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden p-2 text-white rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="surface-panel p-4 mt-2">
              <div className="flex flex-col gap-2">
                {primaryNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`rounded-2xl px-4 py-3 text-left transition-colors ${
                      currentPage === item.id
                        ? "bg-sky-500/15 text-white border border-sky-400/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleNavigation("contact")}
                  className="btn-secondary w-full justify-center"
                >
                  Agendar analise
                </button>
                <button
                  onClick={() => handleNavigation("simulator")}
                  className="btn-primary w-full justify-center"
                >
                  Ver simulador trabalhista
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
