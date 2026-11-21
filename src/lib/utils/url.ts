/** Only http(s) links survive: blocks javascript:/data: in user-edited URLs. */
export function safeUrl(u?: string | null): string {
  if (!u) return "";
  let v = u.trim();
  if (!/^[a-z][a-z0-9+.-]*:/i.test(v) && /^[\w-]+(\.[\w-]+)+/.test(v)) v = "https://" + v;
  try { const x = new URL(v); return x.protocol === "http:" || x.protocol === "https:" ? x.toString() : ""; } catch { return ""; }
}
/** Images: data:image/*, https, or relative export assets. */
export function safeImg(u?: string | null): string {
  if (!u) return "";
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u)) return u;
  if (/^assets\/[\w./-]+$/.test(u)) return u;
  return u.startsWith("https://") ? safeUrl(u) : "";
}
export const displayUrl = (u: string) => u.replace(/^https?:\/\//i, "").replace(/\/$/, "");
