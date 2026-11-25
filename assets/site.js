/* ONEchat — sitio oficial: datos en vivo desde el mismo
   backend de la app (Supabase). Sesión anónima de invitado
   solo para LEER lo público: perfiles registrados, salas y
   galerías. Jamás se exponen correos ni datos privados. */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://jsdyoqmgdkqlkucebjmt.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_FE28e094cucvLYdDFlnxKQ_dxlKjXO-";

export const db = createClient(SUPABASE_URL, PUBLISHABLE_KEY);

let sessionReady = null;
export function ensureSession() {
  if (!sessionReady) {
    sessionReady = (async () => {
      const { data } = await db.auth.getSession();
      if (!data.session) await db.auth.signInAnonymously();
    })().catch(() => {});
  }
  return sessionReady;
}

export function isOnline(lastSeenAt) {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < 6 * 60 * 1000;
}

export function initialOf(nick) {
  return (nick || "?").trim().charAt(0).toUpperCase();
}

export function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function lastSeenText(lastSeenAt) {
  if (!lastSeenAt) return "";
  const d = new Date(lastSeenAt);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "ahora mismo";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}
