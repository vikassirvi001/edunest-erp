import crypto from "node:crypto";
import type { PremiumPurchase, PurchaseProvider } from "@prisma/client";
import { prisma } from "./prisma.js";

/**
 * Creates a new anonymous PremiumPurchase row in `pending` status.
 * No user identity is captured or required — the purchase is keyed
 * solely by the payment provider's session id.
 */
export async function createPendingPurchase(params: {
  articleId: string;
  provider: PurchaseProvider;
  providerSessionId: string;
  amount: number;
}): Promise<PremiumPurchase> {
  return prisma.premiumPurchase.create({
    data: {
      articleId: params.articleId,
      provider: params.provider,
      providerSessionId: params.providerSessionId,
      amount: params.amount,
    },
  });
}

/**
 * Looks up a purchase by the payment provider's session id. This is
 * the sole lookup key for anonymous purchases (no user record exists
 * to join against), and is backed by a unique index so it can only
 * ever return zero or one row.
 */
export async function findByProviderSessionId(
  providerSessionId: string
): Promise<PremiumPurchase | null> {
  return prisma.premiumPurchase.findUnique({
    where: { providerSessionId },
  });
}

/**
 * Generates a cryptographically random, one-time-use token used to
 * gate the unwatermarked download link. Issued only once a purchase
 * is confirmed as paid.
 */
export function generateUnwatermarkedLinkToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Marks a purchase as paid and issues its one-time unwatermarked
 * download token. Enforced unique at the DB level so the token can
 * never be reused across purchases.
 */
export async function markPaid(
  providerSessionId: string
): Promise<PremiumPurchase> {
  return prisma.premiumPurchase.update({
    where: { providerSessionId },
    data: {
      status: "paid",
      unwatermarkedLinkToken: generateUnwatermarkedLinkToken(),
    },
  });
}

/**
 * Marks a purchase as failed. No download token is issued.
 */
export async function markFailed(
  providerSessionId: string
): Promise<PremiumPurchase> {
  return prisma.premiumPurchase.update({
    where: { providerSessionId },
    data: { status: "failed" },
  });
}
