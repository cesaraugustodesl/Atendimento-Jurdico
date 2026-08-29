# Marchetti Advocacia — site institucional

Site institucional premium para escritório de advocacia com posicionamento
principal em Direito Criminal. Construído em Next.js 14 (App Router),
React, TypeScript e Tailwind CSS.

> **Nome do escritório e da advogada são fictícios**, usados apenas para o
> desenvolvimento. Dados sensíveis (OAB, endereço, telefone, e-mail) estão
> como placeholders explícitos — veja a seção "O que preencher antes de
> publicar" abaixo.

## Rodando o projeto localmente

Pré-requisitos: Node.js 18.18 ou superior.

```bash
npm install
npm run dev
```

O site sobe em `http://localhost:3000`.

Para build de produção:

```bash
npm run build
npm run start
```

## Subindo para o Git

```bash
git init
git add .
git commit -m "Site institucional inicial"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

O projeto está pronto para deploy direto na Vercel (recomendado para
Next.js): basta importar o repositório em vercel.com/new.

## Estrutura do projeto

```
app/
  layout.tsx              → layout raiz (fontes, header, footer, WhatsApp)
  page.tsx                → Home
  sobre/                  → Sobre a Advogada
  direito-criminal/       → Página principal de conversão (Direito Criminal)
  areas/                  → Índice + páginas dinâmicas das demais áreas
  atendimento/            → Como funciona o atendimento + formulário
  contato/                → Contato completo + formulário
  faq/                    → Perguntas frequentes
  blog/                   → Listagem + artigos (conteúdos jurídicos)
  sitemap.ts / robots.ts  → SEO técnico (gerados automaticamente)
components/                → Header, Footer, WhatsApp flutuante, formulário, etc.
lib/
  site-config.ts          → nome do escritório, contatos, WhatsApp (PLACEHOLDERS)
  areas-data.ts           → conteúdo das áreas secundárias
  criminal-data.ts        → as 18 frentes de atuação em Direito Criminal
  faq-data.ts             → perguntas e respostas
  blog-data.ts            → artigos de exemplo
  schema.ts               → geração de JSON-LD (LegalService, Attorney, FAQPage, Article, BreadcrumbList)
  metadata.ts             → helper de metadata/SEO por página
  placeholder-images.ts   → imagens do Unsplash usadas como placeholder visual
```

## O que preencher antes de publicar

Busque por `PREENCHER` no projeto (`grep -r "PREENCHER" .`) para localizar
todos os pontos pendentes. Os principais:

- **`lib/site-config.ts`** — número da OAB, domínio definitivo, telefone,
  e-mail, WhatsApp (DDI+DDD+número), endereço completo e URL de
  incorporação do Google Maps.
- **`app/sobre/page.tsx`** — história real da advogada e formação
  acadêmica.
- **`lib/placeholder-images.ts`** — trocar a foto de placeholder da
  advogada (`aboutPortrait`) por fotografia profissional real. As demais
  imagens (arquitetura, tribunal, cidade) podem ser mantidas ou
  substituídas por fotos próprias do escritório.
- **`components/ContactForm.tsx`** — o formulário está funcional no
  front-end, mas o envio (`handleSubmit`) precisa ser conectado a um
  backend/serviço de e-mail (ex.: uma API Route própria, Resend, um CRM).
- **Google Analytics / Search Console** — ainda não incluídos; adicionar
  conforme a ferramenta de analytics escolhida.
- **Favicon e imagem de Open Graph** — adicionar `favicon.ico` e
  `og-image.jpg` na pasta `public/`.

Nenhum número de OAB, endereço, avaliação, cliente, processo, prêmio ou
resultado foi inventado — tudo isso está marcado como placeholder,
conforme solicitado.

## Arquitetura pensada para expansão futura

- Novas áreas de atuação: basta adicionar um item em `lib/areas-data.ts` —
  a página em `/areas/[slug]` é gerada automaticamente.
- Novos artigos: adicionar em `lib/blog-data.ts`.
- Múltiplas advogadas / equipe: pode-se criar uma estrutura semelhante a
  `areas-data.ts` (ex.: `lib/team-data.ts`) e uma rota `app/equipe/[slug]`.
- Páginas por cidade: seguir o mesmo padrão de rota dinâmica usado em
  `app/areas/[slug]`, criando `app/cidades/[slug]` com conteúdo local.

## SEO técnico incluído

- Metadata única por página (title, description, canonical, Open Graph,
  Twitter Card).
- `sitemap.xml` e `robots.txt` gerados automaticamente a partir das
  páginas e conteúdos existentes.
- Dados estruturados (JSON-LD): `LegalService`, `Attorney`, `FAQPage`,
  `Article` e `BreadcrumbList`.
- URLs amigáveis e semânticas em todas as rotas.
