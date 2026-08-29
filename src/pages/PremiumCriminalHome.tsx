import { ArrowRight, ChevronDown, LockKeyhole, Scale, ShieldCheck } from "lucide-react";
import { siteConfig } from "../config/site";

interface Props { onNavigate: (href: string) => void }

const areas = ["Defesa criminal", "Inquérito policial", "Prisão em flagrante", "Habeas corpus", "Tribunal do Júri", "Execução penal"];

export default function PremiumCriminalHome({ onNavigate }: Props) {
  return <main className="premium-site">
    <section className="premium-hero">
      <div className="premium-overlay" />
      <div className="container-custom premium-hero-content">
        <p className="premium-eyebrow">PEREIRA & MONTEIRO ADVOGADOS</p>
        <h1>Advocacia estratégica para decisões que exigem experiência.</h1>
        <p className="premium-lead">Atuação jurídica técnica, personalizada e sigilosa, com especial atenção ao Direito Criminal.</p>
        <div className="premium-actions">
          <button onClick={() => onNavigate("/atendimento")} className="premium-button premium-button-gold">Falar com a Advogada <ArrowRight /></button>
          <button onClick={() => onNavigate("/direito-criminal")} className="premium-button premium-button-ghost">Conheça nossa atuação</button>
        </div>
      </div>
    </section>

    <section className="premium-intro"><div className="container-custom premium-two-col">
      <div><p className="premium-eyebrow dark">DIREITO CRIMINAL</p><h2>Defesa jurídica conduzida com estratégia, discrição e precisão técnica.</h2></div>
      <div><p>Em situações que envolvem liberdade, patrimônio, reputação ou decisões de alto impacto, cada etapa exige análise individualizada. A atuação é construída a partir das circunstâncias concretas do caso, respeitando o sigilo profissional e os limites éticos da advocacia.</p><button onClick={() => onNavigate("/direito-criminal")} className="premium-text-link">Conhecer a atuação criminal <ArrowRight /></button></div>
    </div></section>

    <section className="premium-dark"><div className="container-custom">
      <div className="premium-section-head"><div><p className="premium-eyebrow">ATUAÇÃO</p><h2>Direito Criminal</h2></div><p>Atuação estratégica em diferentes fases da investigação e do processo penal.</p></div>
      <div className="premium-area-grid">{areas.map((area, i) => <button key={area} onClick={() => onNavigate("/direito-criminal")} className="premium-area"><span>0{i + 1}</span><strong>{area}</strong><ArrowRight /></button>)}</div>
      <button onClick={() => onNavigate("/direito-criminal")} className="premium-outline-link">Ver todas as frentes de atuação <ArrowRight /></button>
    </div></section>

    <section className="premium-trust"><div className="container-custom"><p className="premium-eyebrow dark">UMA ATUAÇÃO PERSONALIZADA</p><h2>Experiência jurídica aplicada ao caso concreto.</h2><div className="premium-trust-grid"><div><Scale /><h3>Estratégia</h3><p>Análise criteriosa dos fatos, documentos e riscos jurídicos antes da definição da atuação.</p></div><div><LockKeyhole /><h3>Sigilo</h3><p>Tratamento reservado das informações e comunicação profissional durante todo o atendimento.</p></div><div><ShieldCheck /><h3>Precisão técnica</h3><p>Atuação fundamentada na legislação, jurisprudência e particularidades de cada caso.</p></div></div></div></section>

    <section className="premium-process"><div className="container-custom premium-two-col"><div><p className="premium-eyebrow">ATENDIMENTO</p><h2>Do primeiro contato ao acompanhamento jurídico.</h2></div><ol>{["Primeiro contato", "Análise inicial do caso", "Reunião estratégica", "Definição da estratégia jurídica", "Acompanhamento do processo", "Comunicação com o cliente"].map((x, i) => <li key={x}><span>0{i + 1}</span>{x}</li>)}</ol></div></section>

    <section className="premium-cta"><div className="container-custom"><p className="premium-eyebrow">ATENDIMENTO JURÍDICO</p><h2>Precisa de orientação jurídica?</h2><p>Entre em contato para apresentar sua situação e verificar a possibilidade de atendimento.</p><button onClick={() => onNavigate("/atendimento")} className="premium-button premium-button-gold">Solicitar Atendimento <ArrowRight /></button></div></section>

    <section className="premium-faq"><div className="container-custom"><p className="premium-eyebrow dark">DÚVIDAS FREQUENTES</p><h2>Perguntas frequentes</h2>{["O atendimento é sigiloso?", "É possível atendimento em situação de prisão ou flagrante?", "Como funciona a análise inicial do caso?", "O escritório atua em investigações criminais?"].map(q => <details key={q}><summary>{q}<ChevronDown /></summary><p>O atendimento é individualizado e depende das circunstâncias concretas. As orientações e possibilidades de atuação são apresentadas após a análise jurídica adequada.</p></details>)}</div></section>

    <section className="premium-footer-cta"><div className="container-custom"><h2>{siteConfig.brand.name}</h2><p>Advocacia estratégica, personalizada e sigilosa.</p><button onClick={() => onNavigate("/contato")} className="premium-text-link">Fale conosco <ArrowRight /></button></div></section>
  </main>
}
