/*
  # Create jurisprudencia (case law) table

  1. New Tables
    - `jurisprudencia`
      - `id` (uuid, primary key)
      - `tribunal` (text) - Court name (TST, TRT-2, etc.)
      - `numero_processo` (text) - Case number
      - `titulo` (text) - Short case title
      - `resumo` (text) - Case summary
      - `resultado` (text) - Outcome (procedente, parcialmente procedente, improcedente)
      - `valor_condenacao` (numeric) - Awarded amount if applicable
      - `tags` (text[]) - Array of violation tags for matching
      - `ano` (integer) - Year of the decision
      - `url_fonte` (text) - Source URL for reference
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `jurisprudencia` table
    - Add SELECT policy for anonymous users (public read for case display)

  3. Indexes
    - GIN index on tags for fast array matching
*/

CREATE TABLE IF NOT EXISTS jurisprudencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tribunal text NOT NULL DEFAULT '',
  numero_processo text NOT NULL DEFAULT '',
  titulo text NOT NULL DEFAULT '',
  resumo text NOT NULL DEFAULT '',
  resultado text NOT NULL DEFAULT '',
  valor_condenacao numeric NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  ano integer NOT NULL DEFAULT 2024,
  url_fonte text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE jurisprudencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of jurisprudencia"
  ON jurisprudencia
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_jurisprudencia_tags ON jurisprudencia USING GIN (tags);
