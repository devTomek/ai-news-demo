import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
}

function pageHref(page: number) {
  return page <= 1 ? "/" : `/?page=${page}`;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
      aria-label="Paginacja wpisów"
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Strona {page} z {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? (
          <Link
            href={pageHref(page - 1)}
            className="rounded-full border border-white/70 bg-white/64 px-4 py-2 text-sm font-medium text-zinc-950 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition hover:bg-white/76 dark:border-white/10 dark:bg-zinc-900/62 dark:text-zinc-50 dark:hover:bg-zinc-900/76"
          >
            Poprzednia
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-4 py-2 text-sm text-zinc-400 dark:text-zinc-600">
            Poprzednia
          </span>
        )}

        <ul className="flex flex-wrap items-center gap-1">
          {pageNumbers.map((pageNumber) => {
            const isCurrent = pageNumber === page;

            return (
              <li key={pageNumber}>
                {isCurrent ? (
                  <span
                    aria-current="page"
                    className="flex h-9 min-w-9 items-center justify-center rounded-full bg-zinc-950 px-3 text-sm font-medium text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                  >
                    {pageNumber}
                  </span>
                ) : (
                  <Link
                    href={pageHref(pageNumber)}
                    className="flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium text-zinc-600 transition hover:bg-white/64 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/62 dark:hover:text-zinc-50"
                  >
                    {pageNumber}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {page < totalPages ? (
          <Link
            href={pageHref(page + 1)}
            className="rounded-full border border-white/70 bg-white/64 px-4 py-2 text-sm font-medium text-zinc-950 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition hover:bg-white/76 dark:border-white/10 dark:bg-zinc-900/62 dark:text-zinc-50 dark:hover:bg-zinc-900/76"
          >
            Następna
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-4 py-2 text-sm text-zinc-400 dark:text-zinc-600">
            Następna
          </span>
        )}
      </div>
    </nav>
  );
}
