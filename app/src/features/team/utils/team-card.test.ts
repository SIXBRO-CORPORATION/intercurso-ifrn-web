import { describe, expect, it } from "vitest"
import { getMembersPercent, getTeamCountLabel, getTeamRoleLabel } from "./team-card"

describe("getTeamCountLabel", () => {
    it("inclui o limite quando existe", () => {
        expect(getTeamCountLabel(7, 10)).toBe("7/10 integrantes")
        expect(getTeamCountLabel(1, 10)).toBe("1/10 integrante")
    })

    it("omite o limite quando ausente", () => {
        expect(getTeamCountLabel(3, null)).toBe("3 integrantes")
    })
})

describe("getMembersPercent", () => {
    it("calcula o preenchimento limitado a 100%", () => {
        expect(getMembersPercent(6, 12)).toBe(50)
        expect(getMembersPercent(15, 12)).toBe(100)
    })

    it("retorna zero sem limite", () => {
        expect(getMembersPercent(3, null)).toBe(0)
    })
})

describe("getTeamRoleLabel", () => {
    it("distingue dono, capitão e membro", () => {
        expect(getTeamRoleLabel({ owner_id: "u1", captain_id: "u1" }, "u1")).toBe("Dono")
        expect(getTeamRoleLabel({ owner_id: "u2", captain_id: "u1" }, "u1")).toBe("Capitão")
        expect(getTeamRoleLabel({ owner_id: "u2", captain_id: "u3" }, "u1")).toBe("Membro")
        expect(getTeamRoleLabel({ owner_id: null, captain_id: null }, undefined)).toBe("Membro")
    })
})