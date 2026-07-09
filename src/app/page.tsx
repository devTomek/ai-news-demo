import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Daily Notes",
  description: "Najnowsze wpisy o AI, automatyzacji, modelach i produktach.",
};

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen">
      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-5 py-12 sm:px-6 sm:py-16">
        <div className="border-b border-white/70 pb-8 dark:border-white/10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Najnowsze wpisy o AI
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl dark:text-zinc-50">
            AI Daily Notes
          </h1>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Najnowsze wpisy</span>
          <span>{posts.length} postów</span>
        </div>

        {posts.length > 0 ? (
          <ul className="mt-4 grid gap-5">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group block overflow-hidden rounded-xl border border-white/70 bg-white/64 text-zinc-950 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition duration-300 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/90 hover:-translate-y-1 hover:bg-white/76 hover:shadow-[0_24px_80px_rgba(59,130,246,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-zinc-900/62 dark:text-zinc-50 dark:shadow-black/20 dark:before:bg-white/20 dark:hover:bg-zinc-900/76 dark:hover:shadow-cyan-950/40"
                >
                  <article className="relative">
                    <div className="relative aspect-[2/1] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={post.imageUrl}
                        alt={post.imageAlt}
                        fill
                        sizes="(min-width: 896px) 896px, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-950 backdrop-blur dark:bg-zinc-950/80 dark:text-zinc-50">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{post.createdAt}</span>
                        <span>{post.readTime} min</span>
                      </div>

                      <h2 className="mt-3 text-xl font-semibold leading-snug tracking-normal group-hover:underline group-hover:underline-offset-4">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-300">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-xl border border-white/70 bg-white/64 p-6 text-sm leading-6 text-zinc-600 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/62 dark:text-zinc-300">
            Brak wpisów. Wygeneruj pierwszy post, żeby rozpocząć feed.
          </div>
        )}
      </section>
    </main>
  );
}
