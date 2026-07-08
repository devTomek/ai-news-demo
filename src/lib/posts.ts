import type { Post } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export type PostListItem = Omit<Post, "id" | "content" | "createdAt"> & {
  createdAt: string;
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
  return prisma.post.findUnique({
    where: { slug },
  });
}

function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
