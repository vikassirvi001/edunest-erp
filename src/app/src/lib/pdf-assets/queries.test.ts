import { describe, it, expect, vi, beforeEach } from "vitest";

const findUniqueMock = vi.fn();

vi.mock("../prisma.js", () => ({
  prisma: {
    pdfAsset: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
    },
  },
}));

import { getPdfAssetByDownloadId } from "./queries.js";

describe("getPdfAssetByDownloadId", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it("queries by downloadId and eagerly includes the related article", async () => {
    const fakeAsset = {
      id: "asset-1",
      articleId: "article-1",
      s3KeyFree: "free/asset-1.pdf",
      s3KeyPremium: null,
      downloadId: "abc123",
      article: { id: "article-1", slug: "my-article" },
    };
    findUniqueMock.mockResolvedValue(fakeAsset);

    const result = await getPdfAssetByDownloadId("abc123");

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { downloadId: "abc123" },
      include: { article: true },
    });
    expect(result).toEqual(fakeAsset);
  });

  it("returns null when no PdfAsset matches the downloadId", async () => {
    findUniqueMock.mockResolvedValue(null);

    const result = await getPdfAssetByDownloadId("missing");

    expect(result).toBeNull();
  });
});
