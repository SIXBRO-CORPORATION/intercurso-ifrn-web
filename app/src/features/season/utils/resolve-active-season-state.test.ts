import { describe, expect, it } from "vitest"
import { resolveActiveSeasonState } from "./resolve-active-season-state"

describe("resolveActiveSeasonState", () => {
  it("sem resultado ainda: carregando", () => {
    expect(resolveActiveSeasonState(null, 0)).toEqual({ kind: "loading" })
  })

  it.each([
    [{ kind: "none" }],
    [{ kind: "error" }],
  ] as const)("resultado da tentativa atual é repassado (%j)", (outcome) => {
    expect(resolveActiveSeasonState({ attempt: 0, outcome }, 0)).toEqual(outcome)
  })

  it("ao tentar de novo, volta a carregar até chegar o resultado novo", () => {
    const stale = { attempt: 0, outcome: { kind: "error" } } as const

    expect(resolveActiveSeasonState(stale, 1)).toEqual({ kind: "loading" })
    expect(
      resolveActiveSeasonState({ attempt: 1, outcome: { kind: "none" } }, 1),
    ).toEqual({ kind: "none" })
  })
})
