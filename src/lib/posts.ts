import type { Post } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

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
