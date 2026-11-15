"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ENDPOINT = "https://n8n.manistudio.es/webhook/td-visita";

/**
 * Cookieless visit counter: sends only the page path and the referrer's URL (the server keeps just its domain).
 * No cookies, no storage, no identifiers, so it needs no consent and counts every visitor.
 */
export function Contador() {
  const pathname = usePathname();
  useEffect(() => {
    if (!/(^|\.)tenerifedice\.com$/.test(window.location.hostname)) return;
    const datos = JSON.stringify({ r: pathname, o: document.referrer });
    try {
      if (!navigator.sendBeacon?.(ENDPOINT, datos)) {
        fetch(ENDPOINT, { method: "POST", body: datos, keepalive: true, mode: "no-cors" }).catch(() => {});
      }
    } catch {
      // never break the page for analytics
    }
  }, [pathname]);
  return null;
}
