import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { blogPosts, getPostBySlug } from "@/lib/blog-data";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: siteConfig.siteUrl },
          { name: "Conteúdos", url: `${siteConfig.siteUrl}/blog` },
          { name: post.title, url: `${siteConfig.siteUrl}/blog/${post.slug}` },
        ])}
      />

      <article className="container-content pt-12 pb-24 max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Início", href: "/" },
            { name: "Conteúdos", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <div className="mt-10">
          <Eyebrow code="§ Artigo">{post.category}</Eyebrow>
          <h1 className="mt-6 font-display text-3xl md:text-5xl leading-tight text-ink text-balance">
            {post.title}
          </h1>
          <p className="mt-4 text-xs text-mist-light">
            {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            {" · "}
            {post.readingTime} de leitura
            {" · "}
            {siteConfig.lawyerFullName}
          </p>
        </div>

        <div className="mt-12 space-y-6 max-w-prose">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-ink/85 leading-relaxed text-[17px]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-16 border border-hairline-dark p-8 text-center">
          <p className="font-display text-lg text-ink mb-4">
            Precisa de orientação sobre um caso específico?
          </p>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Falar com a Advogada
          </a>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <p className="code-label mb-6">Leia também</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group border-t border-hairline-dark pt-4">
                  <span className="code-label">{r.category}</span>
                  <h3 className="mt-2 font-display text-lg text-ink group-hover:text-bronze-dim transition-colors">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
