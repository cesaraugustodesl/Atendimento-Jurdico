import { Eye, Lock, Mail, Shield } from "lucide-react";
import { siteConfig } from "../config/site";

const sections = [
  {
    title: "1. Quais dados sao tratados",
    items: [
      "Dados de contato informados voluntariamente, como nome, e-mail e WhatsApp.",
      "Resumo do caso compartilhado no chat, no simulador ou no formulario de contato.",
      "Informacoes tecnicas de navegacao necessarias para funcionamento e seguranca basica do site.",
    ],
  },
  {
    title: "2. Para que usamos esses dados",
    items: [
      "Realizar triagem inicial e organizar a informacao enviada pelo usuario.",
      "Responder contato, encaminhar consulta e manter comunicacao sobre atendimento solicitado.",
      "Melhorar fluxos de navegacao e qualidade da experiencia de uso.",
    ],
  },
  {
    title: "3. Compartilhamento",
    items: [
      "Os dados nao sao vendidos nem compartilhados para marketing de terceiros.",
      "Pode haver compartilhamento tecnico com provedores essenciais de infraestrutura, sempre sob necessidade operacional.",
      "Tambem pode haver compartilhamento por obrigacao legal ou ordem de autoridade competente.",
    ],
  },
  {
    title: "4. Retencao e seguranca",
    items: [
      "A coleta deve ser a minima necessaria para triagem e atendimento.",
      "As informacoes devem permanecer protegidas por medidas tecnicas e organizacionais adequadas.",
      "Nenhum sistema e absolutamente invulneravel, por isso dados altamente sensiveis nao devem ser enviados sem necessidade.",
    ],
  },
  {
    title: "5. Direitos do titular",
    items: [
      "Solicitar acesso, correcao, eliminacao ou esclarecimentos sobre o tratamento.",
      "Revogar consentimento quando essa for a base legal aplicavel.",
      "Pedir informacoes sobre compartilhamento e finalidade do uso.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-4xl">
            <span className="eyebrow">privacidade e dados</span>
            <h1 className="mt-6">Politica de privacidade</h1>
            <p className="mt-6 max-w-2xl text-lg">
              Esta pagina resume como os dados enviados na triagem inicial podem
              ser tratados, sempre com a logica de minimizar coleta e proteger o
              contexto do usuario.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-6">
              <div className="surface-panel p-7">
                <div className="inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">Principio central</h2>
                <p className="mt-4 text-sm leading-7">
                  O site foi reorientado para captar contexto minimo suficiente.
                  A ideia nao e transformar a etapa inicial em upload massivo de
                  informacao sensivel.
                </p>
              </div>

              <div className="surface-card p-7">
                <div className="flex items-start gap-3">
                  <Lock className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Boas praticas para o usuario
                    </p>
                    <p className="mt-2 text-sm leading-7">
                      Evite enviar CPF completo, dados bancarios, laudos medicos
                      extensos ou documentos integrais antes de saber se a
                      equipe realmente precisa deles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-7">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-sky-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Canal para solicitacoes
                    </p>
                    <p className="mt-2 text-sm leading-7">
                      Para temas de privacidade, utilize{" "}
                      {siteConfig.contact.privacyEmail}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {sections.map((section) => (
                <div key={section.title} className="surface-panel p-7">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <div className="mt-5 space-y-4">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" />
                        <p className="text-sm leading-7">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="surface-card p-7">
                <p className="text-sm leading-7">
                  Ultima atualizacao: marco de 2026. Esta politica deve ser lida
                  em conjunto com os termos de uso e com os avisos presentes nos
                  fluxos de chat, simulador e contato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
