import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage === 2 ? `${basePath}/` : `${basePath}/pagina/${currentPage - 1}/`;
  const nextHref = `${basePath}/pagina/${currentPage + 1}/`;

  return (
    <nav
      aria-label="Paginación"
      className="mt-10 flex items-center justify-between border-t border-black/10 pt-6"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/5"
        >
          ← Anterior
        </Link>
      ) : (
        <span />
      )}

      <span className="text-sm text-muted">
        Página {currentPage} de {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/5"
        >
          Siguiente →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
