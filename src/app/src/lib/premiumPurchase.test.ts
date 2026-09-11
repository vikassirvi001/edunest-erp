import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();
const findUniqueMock = vi.fn();
const updateMock = vi.fn();

vi.mock("./prisma.js", () => ({
  prisma: {
    premiumPurchase: {
      create: (...args: unknown[]) => createMock(...args),
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
}));

import {
  createPendingPurchase,
  findByProviderSessionId,
  markPaid,
  markFailed,
  generateUnwatermarkedLinkToken,
} from "./premiumPurchase.js";

describe("premiumPurchase helpers", () => {
  beforeEach(() => {
    createMock.mockReset();
    findUniqueMock.mockReset();
    updateMock.mockReset();
  });

  it("createPendingPurchase creates a row with status pending and no user field", async () => {
    const fakeRow = {
      id: "purchase-1",
      articleId: "article-1",
      provider: "razorpay",
      providerSessionId: "sess_123",
      amount: 4900,
      status: "pending",
      unwatermarkedLinkToken: null,
    };
    createMock.mockResolvedValue(fakeRow);

    const result = await createPendingPurchase({
      articleId: "article-1",
      provider: "razorpay",
      providerSessionId: "sess_123",
      amount: 4900,
    });

    expect(createMock).toHaveBeenCalledWith({
      data: {
        articleId: "article-1",
        provider: "razorpay",
        providerSessionId: "sess_123",
        amount: 4900,
      },
    });
    expect(result).toEqual(fakeRow);
    expect(result).not.toHaveProperty("userId");
  });

  it("findByProviderSessionId returns exactly one row for a paid purchase", async () => {
    const fakeRow = {
      id: "purchase-1",
      articleId: "article-1",
      provider: "razorpay",
      providerSessionId: "sess_123",
      amount: 4900,
      status: "paid",
      unwatermarkedLinkToken: "a".repeat(64),
    };
    findUniqueMock.mockResolvedValue(fakeRow);

    const result = await findByProviderSessionId("sess_123");

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { providerSessionId: "sess_123" },
    });
    expect(result).toEqual(fakeRow);
    expect(result?.status).toBe("paid");
  });

  it("findByProviderSessionId returns null when no purchase matches", async () => {
    findUniqueMock.mockResolvedValue(null);

    const result = await findByProviderSessionId("missing");

    expect(result).toBeNull();
  });

  it("markPaid sets status paid and issues a unique unwatermarked link token", async () => {
    updateMock.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({
        id: "purchase-1",
        providerSessionId: "sess_123",
        ...data,
      })
    );

    const result = await markPaid("sess_123");

    expect(updateMock).toHaveBeenCalledTimes(1);
    const callArgs = updateMock.mock.calls[0][0];
    expect(callArgs.where).toEqual({ providerSessionId: "sess_123" });
    expect(callArgs.data.status).toBe("paid");
    expect(typeof callArgs.data.unwatermarkedLinkToken).toBe("string");
    expect(callArgs.data.unwatermarkedLinkToken).toHaveLength(64);
    expect(result.status).toBe("paid");
  });

  it("markFailed sets status failed and does not issue a token", async () => {
    updateMock.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({
        id: "purchase-1",
        providerSessionId: "sess_123",
        ...data,
      })
    );

    const result = await markFailed("sess_123");

    expect(updateMock).toHaveBeenCalledWith({
      where: { providerSessionId: "sess_123" },
      data: { status: "failed" },
    });
    expect(result.status).toBe("failed");
    expect(result).not.toHaveProperty("unwatermarkedLinkToken");
  });

  it("generateUnwatermarkedLinkToken produces distinct hex tokens", () => {
    const tokenA = generateUnwatermarkedLinkToken();
    const tokenB = generateUnwatermarkedLinkToken();

    expect(tokenA).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenB).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenA).not.toBe(tokenB);
  });
});
