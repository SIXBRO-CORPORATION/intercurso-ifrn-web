import { describe, expect, it } from "vitest"
import { swipeDirection, wrapIndex } from "./carousel"

describe("wrapIndex", () => {
  it.each([
    [0, 4, 0],
    [3, 4, 3],
    [4, 4, 0],
    [5, 4, 1],
    [-1, 4, 3],
    [-5, 4, 3],
  ])("wrapIndex(%i, %i) = %i", (index, total, expected) => {
    expect(wrapIndex(index, total)).toBe(expected)
  })

  it("sem slides, fica em 0", () => {
    expect(wrapIndex(3, 0)).toBe(0)
  })
})

describe("swipeDirection", () => {
  it("arrastar para a esquerda avança", () => {
    expect(swipeDirection(300, 200)).toBe(1)
  })

  it("arrastar para a direita volta", () => {
    expect(swipeDirection(100, 220)).toBe(-1)
  })

  it("movimento curto é ignorado (toque ou rolagem)", () => {
    expect(swipeDirection(100, 120)).toBe(0)
    expect(swipeDirection(100, 70)).toBe(0)
  })
})
