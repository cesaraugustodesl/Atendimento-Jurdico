# Pereira e Monteiro Advogados — site institucional

Site institucional premium para escritório de advocacia com posicionamento principal em Direito Criminal. Construído em Next.js 14 (App Router), React, TypeScript e Tailwind CSS.

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

## Estrutura do projeto

```
app/                     → páginas, SEO, sitemap e robots
components/              → Header, Footer, formulários e componentes visuais
lib/site-config.ts       → identidade, contatos e configuração do escritório
lib/areas-data.ts        → áreas secundárias
lib/criminal-data.ts     → atuação em Direito Criminal
lib/criminal-cluster.ts  → cluster de páginas criminais
lib/faq-data.ts          → perguntas e respostas
lib/blog-data.ts         → conteúdos jurídicos
lib/schema.ts            → dados estruturados JSON-LD
lib/metadata.ts          → metadata/SEO por página
```

## SEO técnico

- Metadata única por página.
- Titles limitados para evitar truncamento nos resultados de busca.
- Canonical, Open Graph e Twitter Card.
- Sitemap e robots gerados pelo Next.js.
- Dados estruturados JSON-LD.
- URLs amigáveis e semânticas.
- Cluster específico para Direito Criminal.

## Informações públicas

- Escritório: Pereira e Monteiro Advogados.
- Atuação: Direito Criminal e demais áreas jurídicas apresentadas no site.
- Localização de atendimento: São Paulo – SP.
- Telefone/WhatsApp: +55 (11) 98439-4849.

Dados profissionais ainda não informados, como número da OAB e e-mail, permanecem fora do conteúdo público até serem fornecidos.
