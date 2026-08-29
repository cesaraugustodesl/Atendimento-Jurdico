import Breadcrumbs from "@/components/Breadcrumbs";
import Eyebrow from "@/components/Eyebrow";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contato",
  description:
    "Entre em contato: WhatsApp, telefone, e-mail, endereço e horário de atendimento do escritório.",
  path: "/contato",
});

export default function ContatoPage() {
  return (
    <>
      <section className="container-content pt-12 pb-8">
        <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Contato", href: "/contato" }]} />
      </section>

      <section className="container-content pb-16 md:pb-20 max-w-2xl">
        <Eyebrow code="§ Contato">Fale Conosco</Eyebrow>
        <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-ink text-balance">
          Estamos à disposição para entender o seu caso.
        </h1>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-content grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-10">
            <div>
              <p className="code-label mb-3">WhatsApp</p>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="link-underline text-ink text-lg">
                Iniciar conversa
              </a>
            </div>
            <div>
              <p className="code-label mb-3">Telefone</p>
              <p className="text-ink text-lg">{siteConfig.phoneDisplay}</p>
            </div>
            <div>
              <p className="code-label mb-3">E-mail</p>
              <p className="text-ink text-lg break-all">{siteConfig.email}</p>
            </div>
            <div>
              <p className="code-label mb-3">Endereço</p>
              <p className="text-ink leading-relaxed">
                {siteConfig.address.line1}
                <br />
                {siteConfig.address.line2}
              </p>
            </div>
            <div>
              <p className="code-label mb-3">Horário de atendimento</p>
              <ul className="space-y-1">
                {siteConfig.hours.map((h) => (
                  <li key={h.label} className="text-ink text-sm">
                    <span className="text-mist">{h.label}:</span> {h.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div className="w-full aspect-[16/9] bg-cream border border-hairline-dark flex items-center justify-center">
              {/* PREENCHER: substituir por <iframe> com a URL de incorporação do Google Maps definida em lib/site-config.ts */}
              <p className="code-label">Mapa — PREENCHER endereço definitivo</p>
            </div>

            <div>
              <Eyebrow code="§ Formulário">Solicitar Atendimento</Eyebrow>
              <h2 className="mt-6 font-display text-2xl text-ink mb-8">
                Envie os detalhes do seu caso
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
