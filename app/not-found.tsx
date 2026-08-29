import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-content py-32 text-center">
      <p className="code-label justify-center">§ 404</p>
      <h1 className="mt-6 font-display text-4xl md:text-5xl text-ink text-balance">
        Página não encontrada.
      </h1>
      <p className="mt-4 text-mist max-w-md mx-auto">
        O conteúdo que você procura pode ter sido movido ou não existe mais.
      </p>
      <Link href="/" className="btn-primary inline-flex mt-10">
        Voltar ao início
      </Link>
    </section>
  );
}
