import Link from "next/link";

import { mockPosts } from "@/lib/mock-posts";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <section className="mx-auto flex w-full max-w-3xl flex-col px-5 py-12 sm:px-6 sm:py-16">
        <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            AI Daily Notes
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl dark:text-zinc-50">
            Spokojny przegląd tego, co dzieje się w AI
          </h1>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Najnowsze wpisy</span>
          <span>{mockPosts.length} postów</span>
        </div>

        <div className="mt-4 grid gap-3">
          {mockPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group rounded-lg border border-zinc-200 bg-white p-5 text-zinc-950 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600"
            >
              <article>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-950 dark:text-zinc-50">
                    {post.category}
                  </span>
                  <span>{post.publishedAt}</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="mt-3 text-xl font-semibold leading-snug tracking-normal group-hover:underline group-hover:underline-offset-4">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-300">
                  {post.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
