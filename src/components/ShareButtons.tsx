"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore, button just won't confirm
    }
  }

  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink/80 transition hover:border-ocean hover:text-ocean";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        Compartir
      </span>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        WhatsApp
      </a>
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        X
      </a>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        Facebook
      </a>
      <button type="button" onClick={copyLink} className={buttonClass}>
        {copied ? (
          <>
            <Check size={13} /> Copiado
          </>
        ) : (
          <>
            <Link2 size={13} /> Copiar enlace
          </>
        )}
      </button>
    </div>
  );
}
