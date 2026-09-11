import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the prisma singleton so this test runs without a live database,
// while still exercising the real filtering logic in queries.ts.
const findManyMock = vi.fn();
const findFirstMock = vi.fn();

vi.mock("../prisma.js", () => ({
  prisma: {
    article: {
      findMany: (...args: unknown[]) => findManyMock(...args),
      findFirst: (...args: unknown[]) => findFirstMock(...args),
    },
  },
}));

import { getPublishedArticles, getPublishedArticleBySlug } from "./queries.js";

type FakeArticle = {
  id: string;
  slug: string;
  isPublished: boolean;
};

const publishedArticle: FakeArticle = {
  id: "1",
  slug: "published-article",
  isPublished: true,
};

describe("published article query helpers", () => {
  beforeEach(() => {
    findManyMock.mockReset();
    findFirstMock.mockReset();
  });

  it("getPublishedArticles filters on isPublished: true", async () => {
    findManyMock.mockResolvedValue([publishedArticle]);

    const result = await getPublishedArticles();

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublished: true },
      })
    );
    expect(result).toEqual([publishedArticle]);
  });

  it("getPublishedArticleBySlug queries with isPublished: true and the given slug", async () => {
    findFirstMock.mockResolvedValue(publishedArticle);

    const result = await getPublishedArticleBySlug("published-article");

    expect(findFirstMock).toHaveBeenCalledWith({
      where: { slug: "published-article", isPublished: true },
    });
    expect(result).toEqual(publishedArticle);
  });

  it("getPublishedArticleBySlug returns null for an unpublished article's slug", async () => {
    // The Prisma `where` clause excludes unpublished articles, so the
    // mock simulates Prisma finding no matching row.
    findFirstMock.mockResolvedValue(null);

    const result = await getPublishedArticleBySlug("draft-article");

    expect(findFirstMock).toHaveBeenCalledWith({
      where: { slug: "draft-article", isPublished: true },
    });
    expect(result).toBeNull();
  });
});
