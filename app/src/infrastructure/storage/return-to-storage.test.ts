import { describe, expect, it } from "vitest"
import { isSafeReturnPath } from "./return-to-storage"

describe("isSafeReturnPath", () => {
  it.each(["/dashboard", "/teams/42?tab=members", "/"])("aceita %s", (p) => {
    expect(isSafeReturnPath(p)).toBe(true)
  })

  it.each([
    "//evil.com",
    "/\\evil.com",
    "https://evil.com",
    "/\n/evil.com",
    "javascript:alert(1)",
    "",
    null,
    "/login",
    "/login?erro=x",
    "/auth/callback",
  ])("rejeita %j", (p) => {
    expect(isSafeReturnPath(p as string | null)).toBe(false)
  })
})
