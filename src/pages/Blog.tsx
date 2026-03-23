import { ArrowRight, BookOpenText, FileText, Scale } from "lucide-react";
import RouteLink from "../components/RouteLink";
import { blogIndexMeta, getFeaturedGuides, getFeaturedPosts } from "../content";
import { pagePaths } from "../config/site";

interface BlogProps {
  onNavigate: (href: string) => void;
}

const featuredGuides = getFeaturedGuides();
const featuredPosts = getFeaturedPosts();

export default function Blog({ onNavigate }: BlogProps) {
  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-4xl">
            <span className="eyebrow">conteudo organico e indexavel</span>
            <h1 className="mt-6">{blogIndexMeta.heroTitle}</h1>
            <p className="mt-6 max-w-3xl text-lg">{blogIndexMeta.heroLead}</p>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container-custom">
          <div className="surface-panel p-7 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <span className="eyebrow">guias de busca real</span>
                <h2 className="section-title mt-5">
                  Paginas desenhadas para intencao de busca e captacao organica.
                </h2>
                <p className="section-lead">
                  Estas paginas atacam buscas mais proximas da necessidade
                  juridica imediata e conectam o usuario com triagem, simulador
                  e atendimento humano.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {featuredGuides.map((guide) => (
                  <RouteLink
                    key={guide.path}
                    href={guide.path}
                    onNavigate={onNavigate}
                    className="surface-card p-5 hover:-translate-y-1"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                      {guide.category}
                    </p>
                    <h3 className="mt-4 text-2xl font-bold text-white">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {guide.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Ler guia
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </RouteLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">blog juridico</span>
              <h2 className="section-title mt-5">
                Artigos para educar, capturar long tail e aquecer a consulta.
              </h2>
            </div>
            <RouteLink
              href={pagePaths.contact}
              onNavigate={onNavigate}
              className="btn-secondary"
            >
              Sair do conteudo e ir para contato
            </RouteLink>
          </div>

          <div className="card-grid mt-10 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <RouteLink
                key={post.path}
                href={post.path}
                onNavigate={onNavigate}
                className="surface-card p-6 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-white">{post.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{post.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                  Abrir artigo
                  <ArrowRight className="h-4 w-4" />
                </span>
              </RouteLink>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="surface-card p-6">
              <BookOpenText className="h-8 w-8 text-sky-300" />
              <h3 className="mt-5 text-2xl font-bold text-white">Busca organica</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Cada guia foi pensado para responder uma duvida com volume
                potencial e intencao clara.
              </p>
            </div>
            <div className="surface-card p-6">
              <FileText className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-5 text-2xl font-bold text-white">Triagem melhor</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                O conteudo prepara o usuario para chegar com fatos, provas e
                perguntas melhores.
              </p>
            </div>
            <div className="surface-card p-6">
              <Scale className="h-8 w-8 text-amber-300" />
              <h3 className="mt-5 text-2xl font-bold text-white">Conversao limpa</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Cada rota aponta com clareza se o proximo passo e chat,
                simulador ou atendimento humano.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
