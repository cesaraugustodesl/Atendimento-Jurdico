/*
  # Create generic simulator leads table

  1. New Tables
    - `simulator_leads`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `simulator_slug` (text)
      - `nome` (text)
      - `whatsapp` (text)
      - `email` (text)
      - `case_summary` (text)
      - `respostas_json` (jsonb)
      - `resultado_json` (jsonb)
      - `lead_score` (integer)
      - `lead_priority` (text)
      - `origem` (text)
      - `page_url` (text)
      - `utm_source` (text)
      - `utm_medium` (text)
      - `utm_campaign` (text)
      - `status` (text)

  2. Security
    - Enable RLS on `simulator_leads`
    - Allow anonymous inserts for public simulator submissions
*/

CREATE TABLE IF NOT EXISTS simulator_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  simulator_slug text NOT NULL DEFAULT '',
  nome text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  case_summary text NOT NULL DEFAULT '',
  respostas_json jsonb NOT NULL DEFAULT '{}',
  resultado_json jsonb NOT NULL DEFAULT '{}',
  lead_score integer NOT NULL DEFAULT 0,
  lead_priority text NOT NULL DEFAULT 'baixa',
  origem text NOT NULL DEFAULT '',
  page_url text NOT NULL DEFAULT '',
  utm_source text NOT NULL DEFAULT '',
  utm_medium text NOT NULL DEFAULT '',
  utm_campaign text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'novo'
);

ALTER TABLE simulator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous simulator lead submissions"
  ON simulator_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read of simulator leads"
  ON simulator_leads
  FOR SELECT
  TO authenticated
  USING (true);
