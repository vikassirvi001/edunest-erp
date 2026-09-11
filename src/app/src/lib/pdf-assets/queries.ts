import type { PdfAsset, Article } from "@prisma/client";
import { prisma } from "../prisma.js";

export type PdfAssetWithArticle = PdfAsset & { article: Article };

/**
 * Returns a PdfAsset by its unique downloadId, eagerly loading the
 * associated Article via the Prisma relation. Used by the
 * /download/[id] route and by the watermarking step that stamps the
 * downloadId into the PDF.
 */
export async function getPdfAssetByDownloadId(
  downloadId: string
): Promise<PdfAssetWithArticle | null> {
  return prisma.pdfAsset.findUnique({
    where: { downloadId },
    include: { article: true },
  });
}
