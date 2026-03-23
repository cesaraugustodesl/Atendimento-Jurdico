# Como Configurar a API do ChatGPT

Para que o chat funcione com inteligência artificial real, você precisa configurar uma chave da API da OpenAI.

## Passo 1: Obter a Chave da API

1. Acesse: https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-`)

## Passo 2: Configurar no Supabase

A chave da API já está configurada automaticamente como secret no seu projeto Supabase com o nome `OPENAI_API_KEY`.

**Importante:** A chave NÃO deve ser colocada no arquivo `.env` do projeto, pois ela é usada no backend (Edge Function) e não no frontend.

## Como Funciona

1. O usuário escreve no chat
2. O frontend envia a mensagem para a Edge Function `chat-juridico`
3. A Edge Function usa a chave da OpenAI para processar a mensagem
4. A resposta formatada volta para o usuário

## Custo

- A API da OpenAI cobra por uso (tokens)
- Modelo usado: GPT-4
- Custo aproximado: $0.03 por 1K tokens de input, $0.06 por 1K tokens de output
- Uma conversa típica pode custar $0.10 - $0.50

## Alternativas Gratuitas

Se preferir não usar a API paga, você pode:

1. Usar o mock que já está no código (descomente no arquivo `Chat.tsx`)
2. Usar modelos gratuitos como Llama via outras APIs
3. Usar serviços com free tier como Anthropic Claude

## Segurança

- A chave da API nunca é exposta no frontend
- Todas as requisições passam pela Edge Function segura
- Os dados são criptografados em trânsito
- Não armazenamos conversas no banco de dados por padrão
