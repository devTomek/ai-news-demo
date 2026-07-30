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

export const POSTS_PER_PAGE = 10;

const postListSelect = {
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  createdAt: true,
  readTime: true,
  imageUrl: true,
  imageAlt: true,
} as const;

export type PostsPage = {
  posts: PostListItem[];
  totalCount: number;
  totalPages: number;
};

export async function getPostsPage(page: number): Promise<PostsPage> {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [totalCount, rows] = await Promise.all([
    prisma.post.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
      select: postListSelect,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));

  return {
    posts: rows.map((post) => ({
      ...post,
      createdAt: formatPostDate(post.createdAt),
    })),
    totalCount,
    totalPages,
  };
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
