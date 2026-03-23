/*
  # Create function to search similar labor cases

  1. New Functions
    - `buscar_casos_similares(violation_tags text[], max_results int)`
      - Searches jurisprudencia table for cases matching given violation tags
      - Returns cases ordered by relevance (number of matching tags) then by award amount
      - Includes a relevancia percentage field showing how well the case matches

  2. Notes
    - Uses array overlap operator (&&) for matching
    - Calculates relevance as percentage of user tags that match case tags
    - Falls back gracefully if no exact matches found
*/

CREATE OR REPLACE FUNCTION buscar_casos_similares(
  violation_tags text[],
  max_results int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  tribunal text,
  numero_processo text,
  titulo text,
  resumo text,
  resultado text,
  valor_condenacao numeric,
  tags text[],
  ano integer,
  url_fonte text,
  relevancia integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.tribunal,
    j.numero_processo,
    j.titulo,
    j.resumo,
    j.resultado,
    j.valor_condenacao,
    j.tags,
    j.ano,
    j.url_fonte,
    CASE
      WHEN array_length(violation_tags, 1) > 0
      THEN (
        SELECT CAST(ROUND(
          (COUNT(*)::numeric / array_length(violation_tags, 1)::numeric) * 100
        ) AS integer)
        FROM unnest(j.tags) AS jt
        WHERE jt = ANY(violation_tags)
      )
      ELSE 0
    END AS relevancia
  FROM jurisprudencia j
  WHERE j.tags && violation_tags
  ORDER BY relevancia DESC, j.valor_condenacao DESC
  LIMIT max_results;
END;
$$;
