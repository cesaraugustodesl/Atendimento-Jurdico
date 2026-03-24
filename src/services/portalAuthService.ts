import type { Session } from "@supabase/supabase-js";
import { pagePaths } from "../config/site";
import { supabase } from "../lib/supabase";

function getPortalRedirectUrl(targetPath: string) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const baseUrl = import.meta.env.VITE_PORTAL_REDIRECT_URL || window.location.origin;
  return `${baseUrl.replace(/\/$/, "")}${targetPath}`;
}

export async function sendPortalMagicLink(
  email: string,
  targetPath: string = pagePaths["client-area"]
) {
  return supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: getPortalRedirectUrl(targetPath),
    },
  });
}

export async function getPortalSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export function onPortalAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signOutPortal() {
  return supabase.auth.signOut();
}
