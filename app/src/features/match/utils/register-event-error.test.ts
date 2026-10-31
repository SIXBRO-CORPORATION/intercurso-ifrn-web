import { AxiosError, type AxiosResponse } from "axios"
import { describe, expect, it } from "vitest"
import { parseRegisterEventError } from "./register-event-error"

const respond = (status: number, data: unknown) =>
  new AxiosError("falhou", "ERR_BAD_REQUEST", undefined, undefined, { status, data } as AxiosResponse)

const GENERIC = "Não foi possível registrar o evento. Tente novamente."

describe("parseRegisterEventError", () => {
  it("usa a mensagem do backend em regra de negócio violada", () => {
    const error = "Jogador expulso não pode marcar pontos"
    expect(parseRegisterEventError(respond(400, { error }))).toBe(error)
  })

  it("trata permissão negada", () => {
    expect(parseRegisterEventError(respond(403, { error: "Forbidden" }))).toBe("Você não tem permissão para registrar eventos.")
  })

  it("usa mensagem genérica para 400 sem texto e para demais status", () => {
    expect(parseRegisterEventError(respond(400, {}))).toBe(GENERIC)
    expect(parseRegisterEventError(respond(500, { error: "boom" }))).toBe(GENERIC)
  })

  it("usa mensagem genérica sem resposta ou fora do axios", () => {
    expect(parseRegisterEventError(new AxiosError("rede"))).toBe(GENERIC)
    expect(parseRegisterEventError(new Error("x"))).toBe(GENERIC)
  })
})
