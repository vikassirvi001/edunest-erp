import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { requireEnv, getDatabaseUrl } from "../env.js";

describe("env validation", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it("throws an error mentioning DATABASE_URL when unset", () => {
    expect(() => requireEnv("DATABASE_URL")).toThrowError(/DATABASE_URL/);
    expect(() => getDatabaseUrl()).toThrowError(/DATABASE_URL/);
  });

  it("returns the value when set", () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
    expect(requireEnv("DATABASE_URL")).toBe("postgresql://user:pass@localhost:5432/db");
    expect(getDatabaseUrl()).toBe("postgresql://user:pass@localhost:5432/db");
  });

  it("throws for any named required variable, not just DATABASE_URL", () => {
    delete process.env.SOME_OTHER_VAR;
    expect(() => requireEnv("SOME_OTHER_VAR")).toThrowError(/SOME_OTHER_VAR/);
  });
});
