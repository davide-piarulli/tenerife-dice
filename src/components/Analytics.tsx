"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "td-cookie-consent";
type Consent = "accepted" | "rejected" | null;

export function Analytics({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Client-only: reads localStorage, which isn't available during static/server rendering.
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "accepted" || stored === "rejected") setConsent(stored);
    } catch {
      // localStorage unavailable (private mode, etc.) — banner stays visible
    }
    setReady(true);
  }, []);

  function choose(value: "accepted" | "rejected") {
    setConsent(value);
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore
    }
  }

  return (
    <>
      {gaId && consent === "accepted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink/80">
              Usamos cookies propias y de análisis (Google Analytics) para entender qué
              contenidos interesan más. Puedes aceptarlas o rechazarlas — el sitio funciona
              igual en ambos casos. Más info en nuestra{" "}
              <a href="/cookies" className="font-semibold text-ocean hover:underline">
                política de cookies
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("rejected")}
                className="rounded-md border border-black/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/5"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-sand hover:bg-ocean-dark"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
