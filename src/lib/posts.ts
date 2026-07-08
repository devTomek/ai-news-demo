import { prisma } from "@/lib/prisma";
import { mockPosts } from "@/lib/mock-posts";

export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt: string;
  readTime: number;
  imageUrl: string;
  imageAlt: string;
};

export async function getPosts(): Promise<PostListItem[]> {
  const formattedMockPosts = mockPosts.map((post) => ({
    ...post,
    createdAt: formatPostDate(new Date(post.createdAt)),
  }));

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    return [
      ...posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        createdAt: formatPostDate(post.createdAt),
        readTime: post.readTime,
        imageUrl: post.imageUrl,
        imageAlt: post.imageAlt,
      })),
      ...formattedMockPosts,
    ];
  } catch {
    return formattedMockPosts;
  }
}

export async function getPostBySlug(slug: string) {
  const mockPost = mockPosts.find((post) => post.slug === slug);

  if (mockPost) {
    return {
      ...mockPost,
      id: mockPost.slug,
      content: `${mockPost.excerpt}\n\nTo jest zamockowana treść wpisu przygotowana na potrzeby strony głównej. Docelowo można podmienić ją na dane z bazy albo zewnętrznego CMS-a.\n\nUkład zostaje prosty: tytuł, lead i kilka akapitów, żeby później łatwo było testować typografię oraz animacje wejścia.`,
      createdAt: new Date(mockPost.createdAt),
    };
  }

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
