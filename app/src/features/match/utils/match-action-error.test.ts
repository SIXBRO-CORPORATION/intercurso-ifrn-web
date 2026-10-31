import { AxiosError, type AxiosResponse } from "axios"
import { describe, expect, it } from "vitest"
import { parseMatchActionError } from "./match-action-error"

const respond = (status: number, data: unknown) =>
  new AxiosError("falhou", "ERR_BAD_REQUEST", undefined, undefined, { status, data } as AxiosResponse)

const GENERIC = "Não foi possível executar a ação. Tente novamente."

describe("parseMatchActionError", () => {
  it("usa a mensagem do backend em regra de negócio violada", () => {
    const error = "Apenas o monitor responsável por esta partida pode registrar eventos"
    expect(parseMatchActionError(respond(400, { error }))).toBe(error)
  })

  it("trata permissão negada", () => {
    expect(parseMatchActionError(respond(403, { error: "Forbidden" }))).toBe("Você não tem permissão para controlar esta partida.")
  })

  it("usa mensagem genérica sem texto, sem resposta ou fora do axios", () => {
    expect(parseMatchActionError(respond(400, {}))).toBe(GENERIC)
    expect(parseMatchActionError(respond(500, { error: "boom" }))).toBe(GENERIC)
    expect(parseMatchActionError(new AxiosError("rede"))).toBe(GENERIC)
    expect(parseMatchActionError(new Error("x"))).toBe(GENERIC)
  })
})
