export type TrackingEventName =
  | "visualizou_home"
  | "visualizou_pagina"
  | "clicou_em_simulador"
  | "iniciou_simulador"
  | "avancou_etapa"
  | "abandonou_etapa"
  | "enviou_lead"
  | "visualizou_resultado"
  | "clicou_whatsapp";

export interface AttributionData {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  landingPath: string;
  landingUrl: string;
  referrer: string;
  capturedAt: string;
}

type TrackingPayload = Record<string, string | number | boolean | null | undefined>;

const ATTRIBUTION_STORAGE_KEY = "aji_attribution_v1";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function sanitizeText(value: string | null) {
  return value?.trim() ?? "";
}

function readAttributionFromStorage(): AttributionData | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AttributionData;
  } catch {
    return null;
  }
}

function persistAttribution(data: AttributionData) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage failures so tracking never blocks the UX.
  }
}

function buildAttributionSnapshot(): AttributionData {
  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: sanitizeText(params.get("utm_source")),
    utmMedium: sanitizeText(params.get("utm_medium")),
    utmCampaign: sanitizeText(params.get("utm_campaign")),
    utmTerm: sanitizeText(params.get("utm_term")),
    utmContent: sanitizeText(params.get("utm_content")),
    landingPath: window.location.pathname,
    landingUrl: window.location.href,
    referrer: typeof document !== "undefined" ? sanitizeText(document.referrer) : "",
    capturedAt: new Date().toISOString(),
  };
}

export function captureAttribution() {
  if (typeof window === "undefined") {
    return null;
  }

  const existing = readAttributionFromStorage();
  const current = buildAttributionSnapshot();
  const hasCurrentUtm = Boolean(
    current.utmSource || current.utmMedium || current.utmCampaign || current.utmTerm || current.utmContent
  );

  if (!existing) {
    persistAttribution(current);
    return current;
  }

  if (hasCurrentUtm) {
    const merged: AttributionData = {
      ...existing,
      utmSource: existing.utmSource || current.utmSource,
      utmMedium: existing.utmMedium || current.utmMedium,
      utmCampaign: existing.utmCampaign || current.utmCampaign,
      utmTerm: existing.utmTerm || current.utmTerm,
      utmContent: existing.utmContent || current.utmContent,
    };
    persistAttribution(merged);
    return merged;
  }

  return existing;
}

export function getAttribution() {
  return readAttributionFromStorage() ?? captureAttribution();
}

function ensureDataLayer() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  return window.dataLayer;
}

export function initializeAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  captureAttribution();

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!measurementId) {
    return;
  }

  if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) {
    return;
  }

  ensureDataLayer();

  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args as unknown as Record<string, unknown>);
    });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.gaId = measurementId;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
  });
}

export function trackEvent(name: TrackingEventName, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const attribution = getAttribution();
  const enrichedPayload = {
    ...payload,
    page_path: window.location.pathname,
    page_url: window.location.href,
    utm_source: attribution?.utmSource ?? "",
    utm_medium: attribution?.utmMedium ?? "",
    utm_campaign: attribution?.utmCampaign ?? "",
    utm_term: attribution?.utmTerm ?? "",
    utm_content: attribution?.utmContent ?? "",
  };

  ensureDataLayer()?.push({
    event: name,
    ...enrichedPayload,
  });

  window.gtag?.("event", name, enrichedPayload);
}

export function trackPageView(path: string, title: string) {
  if (typeof window === "undefined") {
    return;
  }

  const attribution = getAttribution();
  const payload = {
    page_path: path,
    page_title: title,
    page_url: window.location.href,
    utm_source: attribution?.utmSource ?? "",
    utm_medium: attribution?.utmMedium ?? "",
    utm_campaign: attribution?.utmCampaign ?? "",
  };

  ensureDataLayer()?.push({
    event: "page_view",
    ...payload,
  });

  window.gtag?.("event", "page_view", payload);
}
