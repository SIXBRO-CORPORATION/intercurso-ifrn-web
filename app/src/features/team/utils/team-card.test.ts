import { describe, expect, it } from "vitest"
import { getTeamCountLabel } from "./team-card"

describe("getTeamCountLabel", () => {
    it("inclui o limite quando existe", () => {
        expect(getTeamCountLabel(7, 10)).toBe("7/10 integrantes")
        expect(getTeamCountLabel(1, 10)).toBe("1/10 integrante")
    })

    it("omite o limite quando ausente", () => {
        expect(getTeamCountLabel(3, null)).toBe("3 integrantes")
    })
})
