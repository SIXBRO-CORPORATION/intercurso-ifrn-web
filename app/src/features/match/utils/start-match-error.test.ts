import { AxiosError, type AxiosResponse } from "axios"
import { describe, expect, it } from "vitest"
import { parseStartError } from "./start-match-error"

const respond = (status: number, data: unknown) =>
  new AxiosError("falhou", "ERR_BAD_REQUEST", undefined, undefined, { status, data } as AxiosResponse)

const ID = "0f8fad5b-d9cb-469f-a165-70867728950e"

describe("parseStartError", () => {
  it("usa a mensagem do backend quando a partida não está agendada", () => {
    const message = "Somente partidas agendadas (SCHEDULED) podem ser iniciadas. Status atual: IN_PROGRESS"
    expect(parseStartError(respond(400, { error: message }))).toEqual({ message, ongoingMatchId: null })
  })

  it("usa a mensagem do backend quando há times não aprovados", () => {
    const message = "Os seguintes times ainda não estão APPROVED: Águias, Furacão"
    expect(parseStartError(respond(400, { error: message }))).toEqual({ message, ongoingMatchId: null })
  })

  it("extrai o id da partida em andamento e tira o uuid do texto", () => {
    const error = `Monitor já está gerenciando outra partida em andamento (partida ${ID})`
    expect(parseStartError(respond(400, { error }))).toEqual({
      message: "Monitor já está gerenciando outra partida em andamento",
      ongoingMatchId: ID,
    })
  })

  it("trata permissão negada", () => {
    expect(parseStartError(respond(403, { error: "Forbidden" })).message).toBe("Você não tem permissão para iniciar partidas.")
  })

  it("cai na mensagem genérica sem resposta, sem texto ou com outro status", () => {
    const generic = "Não foi possível iniciar a partida. Tente novamente."
    expect(parseStartError(new Error("rede")).message).toBe(generic)
    expect(parseStartError(respond(400, { data: null })).message).toBe(generic)
    expect(parseStartError(respond(500, { error: "x" })).message).toBe(generic)
  })
})
