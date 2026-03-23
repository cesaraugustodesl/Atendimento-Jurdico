import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `Você é um assistente jurídico acolhedor para triagem inicial.

Objetivo:
- explicar a situação em linguagem muito simples;
- organizar fatos, dúvidas e próximos passos;
- sinalizar quando vale procurar atendimento humano com urgência.

Regras:
1. Evite juridiquês.
2. Use frases curtas e linguagem clara.
3. Se houver risco urgente, avise no início em destaque.
4. Não prometa resultado.
5. Quando o usuário mandar novas mensagens, aproveite o contexto anterior em vez de responder como se fosse o primeiro contato.

Formato preferencial:

**RESUMO DO CASO**
[explique em poucas linhas]

**PERGUNTAS IMPORTANTES**
[liste dúvidas que ainda faltam]

**O QUE PODE ACONTECER**
[traga cenários prováveis]

**DOCUMENTOS E PROVAS**
[explique o que reunir]

**PRÓXIMOS PASSOS**
[oriente em ordem de prioridade]

**ATENÇÃO**
[destaque prazo, urgência ou cautela, se houver]

Se o usuário fizer follow-up, responda mantendo o mesmo padrão, mas foque no ponto novo trazido por ele.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function sanitizeMessages(payload: unknown): ChatMessage[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .map((item) => {
      const candidate = item as Record<string, string>;
      return {
        role: candidate.role as "user" | "assistant",
        content: candidate.content.trim(),
      };
    });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    const fallbackMessage =
      typeof body?.message === "string" && body.message.trim().length > 0
        ? [{ role: "user", content: body.message.trim() } satisfies ChatMessage]
        : [];

    const messages = sanitizeMessages(body?.messages).length
      ? sanitizeMessages(body?.messages)
      : fallbackMessage;

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Mensagem inválida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY nao configurada");
      return new Response(
        JSON.stringify({
          error: "Servico temporariamente indisponivel. Tente novamente mais tarde.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 1800,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("Erro da OpenAI:", errorData);
      return new Response(
        JSON.stringify({
          error: "Nao foi possivel processar sua mensagem. Tente novamente.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await openaiResponse.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return new Response(
        JSON.stringify({
          error: "Resposta vazia do provedor de IA.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(
      JSON.stringify({
        error: "Erro ao processar a solicitacao. Tente novamente.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
