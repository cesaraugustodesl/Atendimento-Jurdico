/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_PORTAL_REDIRECT_URL?: string;
  readonly VITE_WHATSAPP_NOTIFICATIONS_ENABLED?: string;
  readonly VITE_JUSBRASIL_MONITORING_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
