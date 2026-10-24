import { describe, expect, it } from "vitest"
import { parseIsoDate, toIsoDate } from "./iso-date"

describe("iso-date", () => {
  it("faz o round-trip sem mudar o dia (sem efeito de fuso)", () => {
    for (const iso of ["2026-01-01", "2026-03-08", "2026-12-31", "2028-02-29"]) {
      expect(toIsoDate(parseIsoDate(iso)!)).toBe(iso)
    }
  })

  it("rejeita formato inválido e datas inexistentes", () => {
    for (const v of ["", "2026-1-1", "01/02/2026", "2026-02-31", "2026-13-01"]) {
      expect(parseIsoDate(v)).toBeUndefined()
    }
  })
})
