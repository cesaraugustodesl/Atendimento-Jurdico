import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  tags: string[];
  limit?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { tags, limit = 5 }: RequestBody = await req.json();

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return new Response(
        JSON.stringify({ error: "tags array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data, error } = await supabase.rpc("buscar_casos_similares", {
      violation_tags: tags,
      max_results: limit,
    });

    if (error) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("jurisprudencia")
        .select("*")
        .overlaps("tags", tags)
        .order("valor_condenacao", { ascending: false })
        .limit(limit);

      if (fallbackError) {
        return new Response(
          JSON.stringify({ error: fallbackError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const casesWithRelevance = (fallbackData || []).map((c: Record<string, unknown>) => {
        const caseTags = (c.tags as string[]) || [];
        const matchCount = caseTags.filter((t: string) => tags.includes(t)).length;
        return { ...c, relevancia: Math.round((matchCount / tags.length) * 100) };
      });

      casesWithRelevance.sort(
        (a: { relevancia: number }, b: { relevancia: number }) =>
          b.relevancia - a.relevancia
      );

      return new Response(JSON.stringify({ cases: casesWithRelevance }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ cases: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
