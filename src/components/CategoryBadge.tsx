import Link from "next/link";
import clsx from "clsx";
import { getCategory } from "@/lib/constants";

const COLOR_MAP: Record<string, string> = {
  ocean: "bg-ocean text-sand",
  sunset: "bg-sunset text-sand",
  gold: "bg-gold text-volcanic",
};

export function CategoryBadge({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const category = getCategory(slug);
  if (!category) return null;

  return (
    <Link
      href={`/categoria/${category.slug}`}
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition hover:opacity-90",
        COLOR_MAP[category.color] ?? "bg-ocean text-sand",
        className,
      )}
    >
      {category.label}
    </Link>
  );
}
