import Link from "next/link";
import clsx from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Tenerife Dice"
    >
      <rect x="2" y="2" width="36" height="36" rx="9" fill="#0b5e73" />
      <path
        d="M2 27c4-3 8-3 12 0s8 3 12 0 8-3 12 0v4.6c0 3.5-2.9 6.4-6.4 6.4H8.4C4.9 38 2 35.1 2 31.6V27z"
        fill="#faf4e9"
        opacity="0.9"
      />
      <circle cx="20" cy="13" r="2.7" fill="#f0a83a" />
      <circle cx="12.5" cy="21.5" r="2.7" fill="#faf4e9" />
      <circle cx="27.5" cy="21.5" r="2.7" fill="#faf4e9" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  showTagline = false,
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={clsx("flex items-center gap-2.5 group", className)}
      aria-label="Tenerife Dice — Portada"
    >
      <LogoMark className={clsx("h-9 w-9 shrink-0", markClassName)} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight text-volcanic">
          Tenerife<span className="text-sunset italic"> Dice</span>
        </span>
        {showTagline && (
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted mt-0.5">
            Lo que la isla cuenta
          </span>
        )}
      </span>
    </Link>
  );
}
