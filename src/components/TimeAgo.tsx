"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/time";

export function TimeAgo({ iso, fallback }: { iso: string; fallback: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // Client-only: avoids a server/client mismatch since relative time depends on render time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(formatRelativeTime(iso));
    const id = setInterval(() => setText(formatRelativeTime(iso)), 60_000);
    return () => clearInterval(id);
  }, [iso]);

  return <span suppressHydrationWarning>{text ?? fallback}</span>;
}
