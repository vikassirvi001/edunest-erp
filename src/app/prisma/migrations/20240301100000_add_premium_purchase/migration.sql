-- CreateEnum
CREATE TYPE "PurchaseProvider" AS ENUM ('razorpay', 'stripe');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('pending', 'paid', 'failed');

-- CreateTable
CREATE TABLE "PremiumPurchase" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "provider" "PurchaseProvider" NOT NULL,
    "providerSessionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'pending',
    "unwatermarkedLinkToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PremiumPurchase_providerSessionId_key" ON "PremiumPurchase"("providerSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PremiumPurchase_unwatermarkedLinkToken_key" ON "PremiumPurchase"("unwatermarkedLinkToken");

-- CreateIndex
CREATE INDEX "PremiumPurchase_articleId_idx" ON "PremiumPurchase"("articleId");

-- AddForeignKey
ALTER TABLE "PremiumPurchase" ADD CONSTRAINT "PremiumPurchase_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
