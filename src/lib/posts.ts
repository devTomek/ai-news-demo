import type { Post } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import type { RecentPostContext } from "@/lib/research";

export type PostListItem = Omit<
  Post,
  "id" | "content" | "createdAt" | "sources"
> & {
  createdAt: string;
};

export type PostSource = {
  title: string;
  publisher: string;
  url: string;
};

export async function getPosts(): Promise<PostListItem[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      createdAt: true,
      readTime: true,
      imageUrl: true,
      imageAlt: true,
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: formatPostDate(post.createdAt),
  }));
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    return null;
  }

  return {
    ...post,
    sources: parsePostSources(post.sources),
  };
}

export async function getRecentPostContext(
  limit = 5,
): Promise<RecentPostContext[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      title: true,
      sources: true,
    },
  });

  return posts.map((post) => ({
    title: post.title,
    sourceUrls: parsePostSources(post.sources).map((source) => source.url),
  }));
}

function parsePostSources(value: unknown): PostSource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((source): source is PostSource => {
    if (!source || typeof source !== "object") {
      return false;
    }

    const maybeSource = source as Record<string, unknown>;

    return (
      typeof maybeSource.title === "string" &&
      typeof maybeSource.publisher === "string" &&
      typeof maybeSource.url === "string"
    );
  });
}

function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
