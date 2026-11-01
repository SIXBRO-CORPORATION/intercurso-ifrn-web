import { describe, expect, it } from "vitest"
import { formatRegistrationPeriod } from "./format-registration-period"

describe("formatRegistrationPeriod", () => {
  it("formata período completo", () => {
    expect(formatRegistrationPeriod("2026-10-14T12:00:00Z", "2026-10-28T12:00:00Z")).toBe("14 de out. de 2026 a 28 de out. de 2026")
  })
  it("formata só início ou só fim", () => {
    expect(formatRegistrationPeriod("2026-10-14T12:00:00Z", null)).toMatch(/^A partir de /)
    expect(formatRegistrationPeriod(undefined, "2026-10-28T12:00:00Z")).toMatch(/^Até /)
  })
  it("retorna null sem datas válidas", () => {
    expect(formatRegistrationPeriod(null, undefined)).toBeNull()
    expect(formatRegistrationPeriod("lixo", "")).toBeNull()
  })
})
