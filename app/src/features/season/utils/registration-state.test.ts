import { describe, expect, it } from "vitest"
import type { Season } from "../schemas/season-schema"
import { getRegistrationState } from "./registration-state"

const now = new Date("2026-03-16T12:00:00")
const base: Season = {
    season_id: "s1",
    name: "Intercurso 2026",
    year: 2026,
    status: "REGISTRATION_OPEN",
    active: true,
    registration_start_date: "2026-03-01T08:00:00",
    registration_end_date: "2026-03-20T23:59:00",
}

describe("getRegistrationState", () => {
    it("informa inscrições abertas com a contagem para o encerramento", () => {
        const state = getRegistrationState(base, now)
        expect(state.open).toBe(true)
        expect(state.detail).toContain("20/03/2026")
        expect(state.detail).toContain("faltam 4 dias")
    })

    it("abre sem detalhe quando não há data de encerramento", () => {
        expect(getRegistrationState({ ...base, registration_end_date: null }, now)).toEqual({
            open: true,
            message: "Inscrições abertas",
            detail: null,
        })
    })

    it("bloqueia e mostra a contagem para a abertura quando a temporada ainda não abriu", () => {
        const state = getRegistrationState({ ...base, status: "DRAFT", registration_start_date: "2026-03-19T08:00:00" }, now)
        expect(state.open).toBe(false)
        expect(state.message).toBe("Não há período de inscrições aberto no momento.")
        expect(state.detail).toContain("Abrem em 19/03/2026")
        expect(state.detail).toContain("faltam 2 dias")
    })

    it("bloqueia sem contagem quando a abertura não está disponível", () => {
        const state = getRegistrationState({ ...base, status: "DRAFT", registration_start_date: null }, now)
        expect(state).toEqual({ open: false, message: "Não há período de inscrições aberto no momento.", detail: null })
    })

    it("bloqueia quando as inscrições foram encerradas ou a temporada está em andamento", () => {
        const message = "Período de inscrições encerrado. Aguarde a próxima temporada."
        expect(getRegistrationState({ ...base, status: "REGISTRATION_CLOSED" }, now).message).toBe(message)
        expect(getRegistrationState({ ...base, status: "IN_PROGRESS" }, now).message).toBe(message)
        expect(getRegistrationState({ ...base, registration_end_date: "2026-03-10T23:59:00" }, now).message).toBe(message)
    })

    it("bloqueia sem temporada ativa", () => {
        const message = "Não há período de inscrições aberto no momento."
        expect(getRegistrationState(null, now).message).toBe(message)
        expect(getRegistrationState({ ...base, active: false }, now).message).toBe(message)
        expect(getRegistrationState({ ...base, status: "FINISHED" }, now).message).toBe(message)
    })
})