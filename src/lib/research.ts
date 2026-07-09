import * as cheerio from "cheerio";
import Parser from "rss-parser";

export type ResearchSource = {
  title: string;
  publisher: string;
  url: string;
  summary: string;
  publishedAt?: string;
};

export type RecentPostContext = {
  title: string;
  sourceUrls: string[];
};

type FeedConfig = {
  publisher: string;
  url: string;
};

type FeedItem = {
  title: string;
  publisher: string;
  url: string;
  summary: string;
  publishedAt?: Date;
};

const parser = new Parser();

const feedConfigs: FeedConfig[] = [
  {
    publisher: "OpenAI",
    url: "https://openai.com/news/rss.xml",
  },
  {
    publisher: "Anthropic",
    url: "https://www.anthropic.com/news/rss.xml",
  },
  {
    publisher: "Google DeepMind",
    url: "https://deepmind.google/discover/blog/rss.xml",
  },
  {
    publisher: "MIT Technology Review",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
  },
  {
    publisher: "TechCrunch",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
  {
    publisher: "The Verge",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
  },
  {
    publisher: "IEEE Spectrum",
    url: "https://spectrum.ieee.org/feeds/topic/robotics/fulltext",
  },
  {
    publisher: "New Atlas",
    url: "https://newatlas.com/robotics/rss/",
  },
];

const researchKeywords = [
  "ai",
  "artificial intelligence",
  "robot",
  "robotics",
  "humanoid",
  "product",
  "device",
  "wearable",
  "startup",
  "science",
  "healthcare",
  "consumer",
  "chip",
  "hardware",
  "autonomous",
  "drone",
  "factory",
  "home",
  "app",
  "assistant",
  "music",
  "video",
  "photo",
  "education",
  "work",
  "travel",
  "car",
  "vehicle",
  "gadget",
  "toy",
  "game",
  "movie",
  "shopping",
];

export async function collectResearchSources(
  recentPosts: RecentPostContext[] = [],
): Promise<ResearchSource[]> {
  const recentlyUsedUrls = new Set(
    recentPosts.flatMap((post) => post.sourceUrls.map(normalizeUrl)),
  );
  const feedResults = await Promise.allSettled(
    feedConfigs.map((feed) => collectFeedItems(feed)),
  );
  const items = feedResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
  const selectedItems = dedupeByUrl(items)
    .filter((item) => !recentlyUsedUrls.has(normalizeUrl(item.url)))
    .filter(isRecentOrUndated)
    .sort(compareFeedItems)
    .slice(0, 8);

  const enrichedResults = await Promise.allSettled(
    selectedItems.map((item) => enrichFeedItem(item)),
  );
  const sources = enrichedResults.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );

  return sources.slice(0, 6);
}

async function collectFeedItems(feed: FeedConfig): Promise<FeedItem[]> {
  const parsedFeed = await parser.parseURL(feed.url);

  return parsedFeed.items
    .map((item) => mapFeedItem(item, feed.publisher))
    .filter((item): item is FeedItem => Boolean(item))
    .filter(matchesResearchTopic)
    .filter((item) => !isDocumentationLike(item))
    .slice(0, 8);
}

function mapFeedItem(
  item: Parser.Item,
  publisher: string,
): FeedItem | null {
  const title = cleanText(item.title ?? "");
  const url = item.link ?? item.guid ?? "";
  const summary = cleanText(
    item.contentSnippet ?? item.summary ?? item.content ?? "",
  );

  if (!title || !isHttpUrl(url)) {
    return null;
  }

  return {
    title,
    publisher,
    url,
    summary: summary.slice(0, 700),
    publishedAt: parseFeedDate(item.isoDate ?? item.pubDate ?? ""),
  };
}

async function enrichFeedItem(item: FeedItem): Promise<ResearchSource> {
  const pageText = await fetchArticleText(item.url).catch(() => "");
  const summary = cleanText([item.summary, pageText].filter(Boolean).join("\n\n"));

  return {
    title: item.title,
    publisher: item.publisher,
    url: item.url,
    summary: summary.slice(0, 1600),
    publishedAt: item.publishedAt?.toISOString(),
  };
}

async function fetchArticleText(url: string) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html",
      "user-agent": "AI Daily Notes research bot (+https://vercel.com)",
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Research fetch failed with ${response.status}: ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const description =
    $('meta[name="description"]').attr("content") ??
    $('meta[property="og:description"]').attr("content") ??
    "";
  const paragraphs = $("p")
    .toArray()
    .map((element) => cleanText($(element).text()))
    .filter((paragraph) => paragraph.length > 80)
    .slice(0, 5)
    .join("\n\n");

  return [description, paragraphs].filter(Boolean).join("\n\n");
}

function parseFeedDate(value: string) {
  if (!value) {
    return undefined;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
}

function matchesResearchTopic(item: FeedItem) {
  const haystack = `${item.title} ${item.summary}`.toLowerCase();

  return researchKeywords.some((keyword) => haystack.includes(keyword));
}

function isDocumentationLike(item: FeedItem) {
  const haystack = `${item.title} ${item.url}`.toLowerCase();

  return [
    "/docs",
    "documentation",
    "api reference",
    "changelog",
    "release notes",
    "sdk",
    "developer",
    "developers",
    "benchmark",
    "evaluation",
    "inference",
    "deployment",
    "coding",
    "code",
    "github",
  ].some((pattern) => haystack.includes(pattern));
}

function isRecentOrUndated(item: FeedItem) {
  if (!item.publishedAt) {
    return true;
  }

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return item.publishedAt.getTime() >= thirtyDaysAgo;
}

function compareFeedItems(a: FeedItem, b: FeedItem) {
  const dateA = a.publishedAt?.getTime() ?? 0;
  const dateB = b.publishedAt?.getTime() ?? 0;

  return dateB - dateA;
}

function dedupeByUrl(items: FeedItem[]) {
  const seen = new Set<string>();
  const dedupedItems: FeedItem[] = [];

  for (const item of items) {
    const key = normalizeUrl(item.url);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    dedupedItems.push(item);
  }

  return dedupedItems;
}

function normalizeUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.hash = "";

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
