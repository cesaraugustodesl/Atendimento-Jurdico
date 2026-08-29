import { siteConfig } from "@/lib/site-config";

export function GET() {
  const content = `# ${siteConfig.firmName}\n\n> ${siteConfig.firmNameFull}\n\n## Site\n- ${siteConfig.siteUrl}\n- Localização: São Paulo – SP\n- Atendimento: ${siteConfig.phoneDisplay}\n\n## Áreas principais\n- Direito Criminal\n- Defesa em investigações e inquéritos\n- Audiência de custódia\n- Habeas corpus\n- Tribunal do Júri\n\n## Navegação\n- ${siteConfig.siteUrl}/sobre\n- ${siteConfig.siteUrl}/direito-criminal\n- ${siteConfig.siteUrl}/areas\n- ${siteConfig.siteUrl}/atendimento\n- ${siteConfig.siteUrl}/blog\n- ${siteConfig.siteUrl}/faq\n- ${siteConfig.siteUrl}/contato\n`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
