import { ArrowRight, Calendar, Clock3, FileText, MessageSquare } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import RouteLink from "../components/RouteLink";
import { getRelatedContent, type BlogPost, type ContentBase, type ServicePage } from "../content";
import { pagePaths } from "../config/site";

interface ContentPageProps {
  entry: ContentBase;
  kind: "service" | "blog";
  onNavigate: (href: string) => void;
}

function isBlogPost(entry: ContentBase): entry is BlogPost {
  return "publishedAt" in entry;
}

function isServicePage(entry: ContentBase): entry is ServicePage {
  return "searchIntent" in entry;
}

export default function ContentPage({ entry, kind, onNavigate }: ContentPageProps) {
  const relatedEntries = getRelatedContent(entry.relatedHrefs);

  return (
    <article className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-4xl">
            <Breadcrumbs
              onNavigate={onNavigate}
              items={[
                { name: "Inicio", path: pagePaths.home },
                { name: "Blog", path: pagePaths.blog },
                { name: entry.title, path: entry.path },
              ]}
            />
            <span className="eyebrow mt-8">{entry.eyebrow}</span>
            <h1 className="mt-6">{entry.heroTitle}</h1>
            <p className="mt-6 max-w-3xl text-lg">{entry.heroLead}</p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <FileText className="h-4 w-4 text-sky-300" />
                {entry.category}
              </span>
              {isBlogPost(entry) && (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <Calendar className="h-4 w-4 text-emerald-300" />
                    {entry.publishedAt}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <Clock3 className="h-4 w-4 text-amber-300" />
                    {entry.readTime}
                  </span>
                </>
              )}
              {isServicePage(entry) && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <MessageSquare className="h-4 w-4 text-sky-300" />
                  Busca alvo: {entry.searchIntent}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container-custom">
          <div className="grid gap-8 xl:grid-cols-[0.72fr_0.28fr]">
            <div className="space-y-6">
              <div className="surface-panel p-7 md:p-8">
                <div className="space-y-4">
                  {entry.intro.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-slate-200">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {entry.sections.map((section) => (
                <section key={section.heading} className="surface-card p-7 md:p-8">
                  <h2 className="text-3xl font-bold">{section.heading}</h2>
                  <div className="mt-5 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-slate-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                      {section.bullets.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <section className="surface-panel p-7 md:p-8">
                <span className="eyebrow">perguntas frequentes</span>
                <h2 className="section-title mt-5">
                  FAQ para reforcar entendimento e rich results.
                </h2>
                <div className="mt-8 space-y-4">
                  {entry.faqs.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-3xl border border-white/10 bg-black/10 p-5"
                    >
                      <h3 className="text-xl font-bold text-white">{item.question}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="surface-panel p-6">
                <span className="eyebrow">proximo passo</span>
                <h2 className="mt-5 text-3xl font-bold">{entry.cta.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{entry.cta.text}</p>
                <RouteLink
                  href={entry.cta.href}
                  onNavigate={onNavigate}
                  className="btn-primary mt-6 w-full"
                >
                  {entry.cta.label}
                </RouteLink>
              </div>

              <div className="surface-card p-6">
                <span className="eyebrow">links internos</span>
                <h2 className="mt-5 text-3xl font-bold">Continue a navegacao</h2>
                <div className="mt-6 space-y-4">
                  {relatedEntries.map((related) => (
                    <RouteLink
                      key={related.path}
                      href={related.path}
                      onNavigate={onNavigate}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-white">{related.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{related.description}</p>
                    </RouteLink>
                  ))}
                </div>
              </div>

              <div className="surface-card p-6">
                <span className="eyebrow">roteamento SEO</span>
                <p className="mt-5 text-sm leading-7 text-slate-300">
                  Esta rota pertence ao bloco de conteudo organico. Ela existe
                  para responder busca, reforcar autoridade e empurrar o usuario
                  para triagem ou consulta.
                </p>
                <RouteLink
                  href={kind === "service" ? pagePaths.contact : pagePaths.chat}
                  onNavigate={onNavigate}
                  className="btn-secondary mt-6 w-full"
                >
                  {kind === "service" ? "Falar com a equipe" : "Levar para o chat"}
                  <ArrowRight className="h-4 w-4" />
                </RouteLink>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
