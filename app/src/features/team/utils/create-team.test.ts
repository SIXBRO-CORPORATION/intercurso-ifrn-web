import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { describe, expect, it } from "vitest"
import { buildInviteUrl, parseCreateTeamError, validateTeamPhoto } from "./create-team"

function httpError(status: number, data?: unknown) {
    const config = {} as InternalAxiosRequestConfig
    return new AxiosError("fail", "ERR_BAD_REQUEST", config, null, { data, status, statusText: "", headers: {}, config })
}

describe("validateTeamPhoto", () => {
    it("aceita PNG, JPG e WEBP até 5 MB", () => {
        expect(validateTeamPhoto({ type: "image/png", size: 5 * 1024 * 1024 })).toBeNull()
        expect(validateTeamPhoto({ type: "image/jpeg", size: 1 })).toBeNull()
        expect(validateTeamPhoto({ type: "image/webp", size: 1 })).toBeNull()
    })

    it("recusa outros tipos e arquivos maiores que 5 MB", () => {
        expect(validateTeamPhoto({ type: "image/gif", size: 1 })).toMatch(/PNG, JPG ou WEBP/)
        expect(validateTeamPhoto({ type: "image/png", size: 5 * 1024 * 1024 + 1 })).toMatch(/5 MB/)
    })
})

describe("buildInviteUrl", () => {
    it("monta o link a partir da origem e do token", () => {
        expect(buildInviteUrl("https://app.test", "a b")).toBe("https://app.test/convite/a%20b")
    })
})

describe("parseCreateTeamError", () => {
    it("repassa a mensagem de regra de negócio do backend", () => {
        const message = "Você já participa de um time nessa modalidade na temporada ativa"
        expect(parseCreateTeamError(httpError(400, { error: message }))).toBe(message)
    })

    it("trata sessão, validação e falhas genéricas", () => {
        expect(parseCreateTeamError(httpError(401))).toMatch(/sessão/)
        expect(parseCreateTeamError(httpError(422))).toMatch(/nome e a foto/)
        expect(parseCreateTeamError(httpError(500))).toMatch(/Tente novamente/)
        expect(parseCreateTeamError(new Error("network"))).toMatch(/Tente novamente/)
    })
})
