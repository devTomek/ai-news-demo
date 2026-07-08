import { prisma } from "@/lib/prisma";
import { mockPosts } from "@/lib/mock-posts";

export async function getPostBySlug(slug: string) {
  const mockPost = mockPosts.find((post) => post.slug === slug);

  if (mockPost) {
    return {
      ...mockPost,
      id: mockPost.slug,
      content: `${mockPost.excerpt}\n\nTo jest zamockowana treść wpisu przygotowana na potrzeby strony głównej. Docelowo można podmienić ją na dane z bazy albo zewnętrznego CMS-a.\n\nUkład zostaje prosty: tytuł, lead i kilka akapitów, żeby później łatwo było testować typografię oraz animacje wejścia.`,
      createdAt: new Date(mockPost.publishedAt),
      updatedAt: new Date(mockPost.publishedAt),
    };
  }

  return prisma.post.findUnique({
    where: { slug },
  });
}
