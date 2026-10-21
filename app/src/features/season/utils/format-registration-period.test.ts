import { describe, expect, it } from "vitest"
import { formatRegistrationPeriod } from "./format-registration-period"

const start = new Date(2026, 8, 1)
const end = new Date(2026, 8, 20)

describe("formatRegistrationPeriod", () => {
  it("sem datas: nada a exibir", () => {
    expect(formatRegistrationPeriod(null, null)).toBeNull()
  })

  it("início e fim: intervalo", () => {
    expect(formatRegistrationPeriod(start, end)).toMatch(
      /^01 de set\.? de 2026 a 20 de set\.? de 2026$/,
    )
  })

  it("só início", () => {
    expect(formatRegistrationPeriod(start, null)).toMatch(
      /^A partir de 01 de set\.? de 2026$/,
    )
  })

  it("só fim", () => {
    expect(formatRegistrationPeriod(null, end)).toMatch(
      /^Até 20 de set\.? de 2026$/,
    )
  })
})
