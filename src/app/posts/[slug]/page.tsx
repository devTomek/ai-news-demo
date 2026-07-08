import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Nie znaleziono wpisu" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(post.createdAt);

  return (
    <main className="min-h-screen">
      <article className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-5 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="w-fit text-sm font-medium text-zinc-500 transition hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Wróć do wpisów
        </Link>

        <header className="mt-8 border-b border-white/70 pb-8 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="rounded-full bg-white/72 px-3 py-1 text-xs font-medium text-zinc-800 shadow-sm backdrop-blur dark:bg-zinc-900/72 dark:text-zinc-100">
              {post.category}
            </span>
            <span>{publishedDate}</span>
            <span>{post.readTime} min</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl dark:text-zinc-50">
            {post.title}
          </h1>
        </header>

        <div className="relative mt-8 aspect-[2/1] overflow-hidden rounded-xl border border-white/70 bg-white/64 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-white/90 dark:border-white/10 dark:bg-zinc-900/62 dark:shadow-black/20 dark:before:bg-white/20">
          <Image
            src={post.imageUrl}
            alt={post.imageAlt}
            fill
            priority
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 dark:to-transparent" />
        </div>

        <div className="relative mt-8 rounded-xl border border-white/70 bg-white/64 p-5 text-zinc-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/90 sm:p-7 dark:border-white/10 dark:bg-zinc-900/62 dark:text-zinc-200 dark:shadow-black/20 dark:before:bg-white/20">
          <div className="space-y-6 text-base leading-8 sm:text-lg sm:leading-9">
            {post.content.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
