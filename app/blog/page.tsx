import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import { blogPosts, blogCategories } from "@/lib/blog-data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Conteúdos Jurídicos",
  description:
    "Artigos sobre Direito Criminal, Processo Penal, Tribunal do Júri, prisão e liberdade, Direito de Família e outros temas jurídicos relevantes.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <section className="container-content pt-12 pb-8">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Conteúdos", href: "/blog" }]} />
      </section>

      <section className="container-content pb-16 max-w-2xl">
        <Eyebrow code="§ Conteúdos">Artigos Jurídicos</Eyebrow>
        <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-ink text-balance">
          Conteúdo técnico para compreender melhor cada processo.
        </h1>
      </section>

      <section className="container-content pb-10">
        <div className="flex flex-wrap gap-3">
          {blogCategories.map((cat) => (
            <span key={cat} className="code-label border border-hairline-dark px-3 py-2">
              {cat}
            </span>
          ))}
        </div>
      </section>

      <section className="container-content pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 mt-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group border-t border-hairline-dark pt-6 block">
              <span className="code-label">{post.category}</span>
              <h2 className="mt-4 font-display text-xl text-ink leading-snug group-hover:text-bronze-dim transition-colors">
                {post.title}
              </h2>
              <p className="mt-3 text-mist text-sm leading-relaxed">{post.excerpt}</p>
              <p className="mt-4 text-xs text-mist-light">
                {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                {" · "}
                {post.readingTime} de leitura
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
