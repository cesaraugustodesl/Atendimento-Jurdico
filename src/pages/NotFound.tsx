import { ArrowLeft, BookOpenText, Home, MessageSquare } from "lucide-react";
import RouteLink from "../components/RouteLink";
import { pagePaths } from "../config/site";

interface NotFoundProps {
  onNavigate: (href: string) => void;
}

export default function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl surface-panel p-8 text-center md:p-12">
            <span className="eyebrow">erro 404</span>
            <h1 className="mt-6">Pagina nao encontrada</h1>
            <p className="mt-6 text-lg text-slate-300">
              A rota que voce tentou abrir nao existe ou saiu do ar. Volte para
              a home, navegue pelo blog ou siga direto para triagem.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <RouteLink href={pagePaths.home} onNavigate={onNavigate} className="btn-primary">
                <Home className="h-5 w-5" />
                Voltar para a home
              </RouteLink>
              <RouteLink href={pagePaths.blog} onNavigate={onNavigate} className="btn-secondary">
                <BookOpenText className="h-5 w-5" />
                Abrir blog
              </RouteLink>
            </div>
            <RouteLink
              href={pagePaths.chat}
              onNavigate={onNavigate}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300"
            >
              <MessageSquare className="h-4 w-4" />
              Ir para o chat juridico
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </RouteLink>
          </div>
        </div>
      </section>
    </div>
  );
}
