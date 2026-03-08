import { getAuth } from "@clerk/express";

const FRONTEND_URL = process.env.FRONTEND_URL;

/* -------- Safely convert value to number or return null -------- */
export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* -------- Get frontend base URL from env or request -------- */
export const buildFrontendBase = (req) => {
  if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
  const origin = req.get("origin") || req.get("referer");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.get("host");
  if (host) return `${req.protocol || "http"}://${host}`.replace(/\/$/, "");
  return null;
};

/* -------- Get Clerk user ID safely from request -------- */
export function resolveClerkUserId(req) {
  try {
    const auth = req.auth || {};
    const fromReq =
      auth?.userId || auth?.user_id || auth?.user?.id || req.user?.id || null;
    if (fromReq) return fromReq;
    try {
      const serverAuth = getAuth ? getAuth(req) : null;
      return serverAuth?.userId || null;
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
}
