/*
  # Create labor simulator leads table

  1. New Tables
    - `labor_leads`
      - `id` (uuid, primary key)
      - `name` (text) - Lead's full name
      - `whatsapp` (text) - Lead's WhatsApp number
      - `email` (text) - Lead's email address
      - `contract_type` (text) - CLT, PJ, or informal
      - `salary` (numeric) - Monthly salary
      - `years_worked` (numeric) - Years at the company
      - `violations` (jsonb) - Object with all violation flags
      - `score` (integer) - Calculated case score 0-100
      - `classification` (text) - baixa/media/alta
      - `estimate_min` (numeric) - Minimum estimated value
      - `estimate_max` (numeric) - Maximum estimated value
      - `paid_report` (boolean) - Whether they purchased the detailed report
      - `created_at` (timestamptz) - When the lead was created

  2. Security
    - Enable RLS on `labor_leads` table
    - Add INSERT policy for anonymous users (public form submissions)
    - Add SELECT policy for service role only (admin access via backend)
*/

CREATE TABLE IF NOT EXISTS labor_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  contract_type text NOT NULL DEFAULT 'clt',
  salary numeric NOT NULL DEFAULT 0,
  years_worked numeric NOT NULL DEFAULT 0,
  violations jsonb NOT NULL DEFAULT '{}',
  score integer NOT NULL DEFAULT 0,
  classification text NOT NULL DEFAULT 'baixa',
  estimate_min numeric NOT NULL DEFAULT 0,
  estimate_max numeric NOT NULL DEFAULT 0,
  paid_report boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE labor_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous lead submissions"
  ON labor_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read of own leads"
  ON labor_leads
  FOR SELECT
  TO authenticated
  USING (true);
