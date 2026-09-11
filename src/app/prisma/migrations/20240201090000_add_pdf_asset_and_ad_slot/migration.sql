-- CreateTable
CREATE TABLE "PdfAsset" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "s3KeyFree" TEXT NOT NULL,
    "s3KeyPremium" TEXT,
    "downloadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdfAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSlot" (
    "id" TEXT NOT NULL,
    "slotName" TEXT NOT NULL,
    "adClient" TEXT NOT NULL,
    "adSlotId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PdfAsset_downloadId_key" ON "PdfAsset"("downloadId");

-- CreateIndex
CREATE INDEX "PdfAsset_articleId_idx" ON "PdfAsset"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "AdSlot_slotName_key" ON "AdSlot"("slotName");

-- AddForeignKey
ALTER TABLE "PdfAsset" ADD CONSTRAINT "PdfAsset_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
