# Publicacao

O projeto esta pronto para deploy estatico com paginas pre-renderizadas por rota, sitemap, robots e 404 personalizada.

## Opcao mais simples: Vercel

1. Entre em `https://vercel.com`.
2. Clique em `Add New...` > `Project`.
3. Importe o repositorio `Atendimento-Jurdico`.
4. Deixe:
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Clique em `Deploy`.

O build gera HTML proprio para rotas como `/chat-ia`, `/contato`, `/blog` e paginas de conteudo organico. Isso melhora indexacao, compartilhamento e 404.

## Opcao simples: Netlify

1. Entre em `https://app.netlify.com`.
2. Clique em `Add new site` > `Import an existing project`.
3. Conecte o repositorio `Atendimento-Jurdico`.
4. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy.

O projeto inclui `netlify.toml` com build estatico. Como as rotas sao geradas como arquivos HTML reais, nao ha dependencia de fallback global de SPA.

## Cloudflare Pages

1. Entre em `https://dash.cloudflare.com`.
2. Va em `Workers & Pages`.
3. Clique em `Create application` > `Pages` > `Import an existing Git repository`.
4. Selecione o repositorio.
5. Configure:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Deploy.

Como as principais rotas sao entregues como HTML estatico, a plataforma pode servir cada pagina diretamente sem depender de rewrite amplo.

## Endereco publico

Depois do deploy, a plataforma gera um dominio gratuito, por exemplo:

- Vercel: `seu-projeto.vercel.app`
- Netlify: `seu-projeto.netlify.app`
- Cloudflare Pages: `seu-projeto.pages.dev`

Se voce quiser um dominio proprio, inclusive terminando em `.host`, precisa:

1. Comprar o dominio com um registrador.
2. Adicionar esse dominio na plataforma escolhida.
3. Apontar os DNS conforme a tela da plataforma.

## Variaveis de ambiente

No host, configure as mesmas variaveis usadas localmente:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Se as Edge Functions estiverem em outro projeto Supabase, mantenha as mesmas chaves desse projeto.
