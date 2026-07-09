import { NextRequest } from "next/server";
import slugify from "slugify";

import { generatePostDraft } from "@/lib/genai";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const expectedCronSchedule = "0 8 * * *";

const unsplashImages = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=1200&q=80",
];

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const draft = await generatePostDraft();
    const slug = await createUniqueSlug(draft.title);
    const post = await prisma.post.create({
      data: {
        slug,
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
        category: draft.category,
        readTime: draft.readTime,
        imageUrl: pickImageUrl(slug),
        imageAlt: draft.imageAlt,
      },
    });

    return Response.json({
      success: true,
      post: {
        slug: post.slug,
        title: post.title,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown post generation error.";

    return Response.json({ error: message }, { status: 500 });
  }
}

function isAuthorizedCronRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  return (
    request.headers.get("user-agent") === "vercel-cron/1.0" &&
    request.headers.get("x-vercel-cron-schedule") === expectedCronSchedule
  );
}

async function createUniqueSlug(title: string) {
  const baseSlug = createSlug(title) || `post-${Date.now()}`;
  const postsWithSimilarSlugs = await prisma.post.findMany({
    where: {
      OR: [
        { slug: baseSlug },
        { slug: { startsWith: `${baseSlug}-` } },
      ],
    },
    select: { slug: true },
  });

  if (postsWithSimilarSlugs.length === 0) {
    return baseSlug;
  }

  return `${baseSlug}-${postsWithSimilarSlugs.length + 1}`;
}

function createSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    locale: "pl",
  });
}

function pickImageUrl(seed: string) {
  let index = 0;

  for (const character of seed) {
    index += character.charCodeAt(0);
  }

  return unsplashImages[index % unsplashImages.length];
}
