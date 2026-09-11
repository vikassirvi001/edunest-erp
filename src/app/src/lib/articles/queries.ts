import type { Article } from "@prisma/client";
import { prisma } from "../prisma.js";

/**
 * Returns all published articles, most recently created first.
 *
 * Centralizes the `isPublished: true` filter so unpublished/draft
 * articles never leak into public-facing listings.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  return prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Returns a single published article by slug, or null if it doesn't
 * exist or is not published.
 */
export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  return prisma.article.findFirst({
    where: { slug, isPublished: true },
  });
}
