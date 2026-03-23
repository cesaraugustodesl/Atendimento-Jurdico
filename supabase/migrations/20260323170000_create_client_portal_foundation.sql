/*
  # Create client portal foundation

  1. New tables
    - `staff_profiles`
    - `client_profiles`
    - `legal_cases`
    - `case_updates`
    - `case_documents`
    - `case_notifications`

  2. Helper functions
    - `set_updated_at`
    - `is_staff_user`
    - `claim_client_profile`

  3. Security
    - Enable RLS on all portal tables
    - Client reads only own data
    - Staff reads and writes all portal data

  4. Realtime
    - Add portal tables to `supabase_realtime`
*/

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'staff',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (role IN ('staff', 'admin'))
);

CREATE TABLE IF NOT EXISTS public.client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'ativo',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN ('ativo', 'inativo', 'aguardando-acesso'))
);

CREATE UNIQUE INDEX IF NOT EXISTS client_profiles_email_unique_idx
  ON public.client_profiles ((lower(email)))
  WHERE email <> '';

CREATE TABLE IF NOT EXISTS public.legal_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  simulator_lead_id uuid REFERENCES public.simulator_leads(id) ON DELETE SET NULL,
  case_code text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'triagem',
  priority text NOT NULL DEFAULT 'media',
  cnj_number text NOT NULL DEFAULT '',
  assigned_lawyer text NOT NULL DEFAULT '',
  next_deadline_at timestamptz,
  last_event_at timestamptz,
  last_event_summary text NOT NULL DEFAULT '',
  monitor_provider text NOT NULL DEFAULT '',
  monitor_reference text NOT NULL DEFAULT '',
  whatsapp_opt_in boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN (
    'triagem',
    'analise-inicial',
    'documentos-pendentes',
    'em-andamento',
    'aguardando-terceiros',
    'audiencia-designada',
    'concluido'
  )),
  CHECK (priority IN ('baixa', 'media', 'alta'))
);

CREATE INDEX IF NOT EXISTS legal_cases_client_id_idx ON public.legal_cases (client_id);
CREATE INDEX IF NOT EXISTS legal_cases_status_idx ON public.legal_cases (status);
CREATE INDEX IF NOT EXISTS legal_cases_updated_at_idx ON public.legal_cases (updated_at DESC);
CREATE INDEX IF NOT EXISTS legal_cases_cnj_idx ON public.legal_cases (cnj_number);

CREATE TABLE IF NOT EXISTS public.case_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.legal_cases(id) ON DELETE CASCADE,
  update_type text NOT NULL DEFAULT 'status',
  source text NOT NULL DEFAULT 'manual',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  visible_to_client boolean NOT NULL DEFAULT true,
  highlight boolean NOT NULL DEFAULT false,
  external_event_id text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  event_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (update_type IN ('status', 'movimentacao', 'documento', 'prazo', 'mensagem', 'audiencia')),
  CHECK (source IN ('manual', 'jusbrasil', 'tribunal', 'cliente', 'whatsapp'))
);

CREATE INDEX IF NOT EXISTS case_updates_case_id_idx ON public.case_updates (case_id);
CREATE INDEX IF NOT EXISTS case_updates_event_at_idx ON public.case_updates (event_at DESC);

CREATE TABLE IF NOT EXISTS public.case_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.legal_cases(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  document_type text NOT NULL DEFAULT 'anexo',
  file_path text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  mime_type text NOT NULL DEFAULT '',
  storage_bucket text NOT NULL DEFAULT 'case-files',
  uploaded_by text NOT NULL DEFAULT 'staff',
  visible_to_client boolean NOT NULL DEFAULT true,
  requested_from_client boolean NOT NULL DEFAULT false,
  uploaded_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (uploaded_by IN ('staff', 'client', 'system'))
);

CREATE INDEX IF NOT EXISTS case_documents_case_id_idx ON public.case_documents (case_id);
CREATE INDEX IF NOT EXISTS case_documents_uploaded_at_idx ON public.case_documents (uploaded_at DESC);

CREATE TABLE IF NOT EXISTS public.case_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.legal_cases(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'portal',
  notification_type text NOT NULL DEFAULT 'update',
  recipient text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  provider text NOT NULL DEFAULT '',
  provider_message_id text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (channel IN ('portal', 'email', 'whatsapp')),
  CHECK (status IN ('pending', 'queued', 'sent', 'delivered', 'failed', 'read'))
);

CREATE INDEX IF NOT EXISTS case_notifications_case_id_idx ON public.case_notifications (case_id);
CREATE INDEX IF NOT EXISTS case_notifications_created_at_idx ON public.case_notifications (created_at DESC);

DROP TRIGGER IF EXISTS set_staff_profiles_updated_at ON public.staff_profiles;
CREATE TRIGGER set_staff_profiles_updated_at
BEFORE UPDATE ON public.staff_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_client_profiles_updated_at ON public.client_profiles;
CREATE TRIGGER set_client_profiles_updated_at
BEFORE UPDATE ON public.client_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_legal_cases_updated_at ON public.legal_cases;
CREATE TRIGGER set_legal_cases_updated_at
BEFORE UPDATE ON public.legal_cases
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_case_updates_updated_at ON public.case_updates;
CREATE TRIGGER set_case_updates_updated_at
BEFORE UPDATE ON public.case_updates
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_case_documents_updated_at ON public.case_documents;
CREATE TRIGGER set_case_documents_updated_at
BEFORE UPDATE ON public.case_documents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_case_notifications_updated_at ON public.case_notifications;
CREATE TRIGGER set_case_notifications_updated_at
BEFORE UPDATE ON public.case_notifications
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.is_staff_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.staff_profiles
    WHERE user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_staff_user() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_client_profile(
  profile_name text DEFAULT '',
  profile_whatsapp text DEFAULT ''
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  normalized_name text := coalesce(profile_name, '');
  normalized_whatsapp text := coalesce(profile_whatsapp, '');
  existing_id uuid;
  existing_auth uuid;
BEGIN
  IF auth.uid() IS NULL OR normalized_email = '' THEN
    RAISE EXCEPTION 'Authenticated user with e-mail is required';
  END IF;

  SELECT id, auth_user_id
    INTO existing_id, existing_auth
  FROM public.client_profiles
  WHERE lower(email) = normalized_email
  LIMIT 1;

  IF existing_id IS NULL THEN
    INSERT INTO public.client_profiles (
      auth_user_id,
      full_name,
      email,
      whatsapp,
      status
    )
    VALUES (
      auth.uid(),
      normalized_name,
      normalized_email,
      normalized_whatsapp,
      'ativo'
    )
    RETURNING id INTO existing_id;

    RETURN existing_id;
  END IF;

  IF existing_auth IS NOT NULL AND existing_auth <> auth.uid() THEN
    RAISE EXCEPTION 'Client profile already linked to another account';
  END IF;

  UPDATE public.client_profiles
  SET
    auth_user_id = auth.uid(),
    full_name = CASE
      WHEN full_name = '' AND normalized_name <> '' THEN normalized_name
      ELSE full_name
    END,
    whatsapp = CASE
      WHEN whatsapp = '' AND normalized_whatsapp <> '' THEN normalized_whatsapp
      ELSE whatsapp
    END,
    status = CASE
      WHEN status = 'aguardando-acesso' THEN 'ativo'
      ELSE status
    END,
    updated_at = now()
  WHERE id = existing_id;

  RETURN existing_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_client_profile(text, text) TO authenticated;

ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can read own profile" ON public.staff_profiles;
CREATE POLICY "Staff can read own profile"
  ON public.staff_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Client can read own profile" ON public.client_profiles;
CREATE POLICY "Client can read own profile"
  ON public.client_profiles
  FOR SELECT
  TO authenticated
  USING (
    public.is_staff_user()
    OR auth_user_id = auth.uid()
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

DROP POLICY IF EXISTS "Staff can manage client profiles" ON public.client_profiles;
CREATE POLICY "Staff can manage client profiles"
  ON public.client_profiles
  FOR ALL
  TO authenticated
  USING (public.is_staff_user())
  WITH CHECK (public.is_staff_user());

DROP POLICY IF EXISTS "Client can read own cases" ON public.legal_cases;
CREATE POLICY "Client can read own cases"
  ON public.legal_cases
  FOR SELECT
  TO authenticated
  USING (
    public.is_staff_user()
    OR EXISTS (
      SELECT 1
      FROM public.client_profiles
      WHERE public.client_profiles.id = legal_cases.client_id
        AND public.client_profiles.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Staff can manage cases" ON public.legal_cases;
CREATE POLICY "Staff can manage cases"
  ON public.legal_cases
  FOR ALL
  TO authenticated
  USING (public.is_staff_user())
  WITH CHECK (public.is_staff_user());

DROP POLICY IF EXISTS "Client can read own case updates" ON public.case_updates;
CREATE POLICY "Client can read own case updates"
  ON public.case_updates
  FOR SELECT
  TO authenticated
  USING (
    public.is_staff_user()
    OR EXISTS (
      SELECT 1
      FROM public.legal_cases
      JOIN public.client_profiles
        ON public.client_profiles.id = public.legal_cases.client_id
      WHERE public.legal_cases.id = case_updates.case_id
        AND public.client_profiles.auth_user_id = auth.uid()
        AND case_updates.visible_to_client = true
    )
  );

DROP POLICY IF EXISTS "Staff can manage case updates" ON public.case_updates;
CREATE POLICY "Staff can manage case updates"
  ON public.case_updates
  FOR ALL
  TO authenticated
  USING (public.is_staff_user())
  WITH CHECK (public.is_staff_user());

DROP POLICY IF EXISTS "Client can read own case documents" ON public.case_documents;
CREATE POLICY "Client can read own case documents"
  ON public.case_documents
  FOR SELECT
  TO authenticated
  USING (
    public.is_staff_user()
    OR EXISTS (
      SELECT 1
      FROM public.legal_cases
      JOIN public.client_profiles
        ON public.client_profiles.id = public.legal_cases.client_id
      WHERE public.legal_cases.id = case_documents.case_id
        AND public.client_profiles.auth_user_id = auth.uid()
        AND case_documents.visible_to_client = true
    )
  );

DROP POLICY IF EXISTS "Staff can manage case documents" ON public.case_documents;
CREATE POLICY "Staff can manage case documents"
  ON public.case_documents
  FOR ALL
  TO authenticated
  USING (public.is_staff_user())
  WITH CHECK (public.is_staff_user());

DROP POLICY IF EXISTS "Client can read own case notifications" ON public.case_notifications;
CREATE POLICY "Client can read own case notifications"
  ON public.case_notifications
  FOR SELECT
  TO authenticated
  USING (
    public.is_staff_user()
    OR EXISTS (
      SELECT 1
      FROM public.legal_cases
      JOIN public.client_profiles
        ON public.client_profiles.id = public.legal_cases.client_id
      WHERE public.legal_cases.id = case_notifications.case_id
        AND public.client_profiles.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Staff can manage case notifications" ON public.case_notifications;
CREATE POLICY "Staff can manage case notifications"
  ON public.case_notifications
  FOR ALL
  TO authenticated
  USING (public.is_staff_user())
  WITH CHECK (public.is_staff_user());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'legal_cases'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.legal_cases;
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'case_updates'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.case_updates;
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'case_documents'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.case_documents;
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'case_notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.case_notifications;
  END IF;
END;
$$;
