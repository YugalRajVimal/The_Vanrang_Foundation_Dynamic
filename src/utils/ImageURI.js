import { UPLOAD_URL } from "../api/client";


/**
 * Resolves a possibly-relative upload path (e.g. "/uploads/team/x.png")
 * into a full URL using UPLOAD_URL. Leaves already-absolute URLs untouched.
 */
export function getFullImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  // avoid double slashes between prefix and url
  return UPLOAD_URL.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
}