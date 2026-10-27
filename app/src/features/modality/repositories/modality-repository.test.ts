import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it } from "vitest"
import { api } from "@/lib/axios"
import { listModalities } from "./modality-repository"
import { listModalityTeams } from "./modality-teams-repository"

const modality = {
  modality_id: "m1",
  name: "Futsal",
  min_members: 5,
  max_members: 10,
  gender_mode: "MIXED",
  min_male_members: 1,
  min_female_members: 1,
  active: true,
  photo: null,
}

let reply: unknown
let status: number
let calls: InternalAxiosRequestConfig[]
const signal = new AbortController().signal

beforeEach(() => {
  calls = []
  status = 200
  api.defaults.adapter = async (config) => {
    calls.push(config)
    const response = { data: reply, status, statusText: "", headers: {}, config }
    if (status >= 400) throw new AxiosError("fail", "ERR_BAD_REQUEST", config, null, response)
    return response
  }
})

describe("listModalities", () => {
  it("envia a temporada e devolve só modalidades ativas", async () => {
    reply = { data: [modality, { ...modality, modality_id: "m2", active: false }] }
    const result = await listModalities("s1", signal)
    expect(calls[0].url).toBe("/api/modality/")
    expect(calls[0].params).toEqual({ season_id: "s1" })
    expect(result.map((item) => item.modality_id)).toEqual(["m1"])
  })

  it("não envia query sem temporada e aceita data nulo", async () => {
    reply = { data: null }
    expect(await listModalities(undefined, signal)).toEqual([])
    expect(calls[0].params).toBeUndefined()
  })

  it("rejeita resposta fora do contrato", async () => {
    reply = { data: [{ ...modality, gender_mode: "OUTRO" }] }
    await expect(listModalities(undefined, signal)).rejects.toThrow()
  })

  it("repassa erros de rede/HTTP", async () => {
    status = 500
    await expect(listModalities(undefined, signal)).rejects.toThrow()
  })
})

describe("listModalityTeams", () => {
  const team = { team_id: "t1", name: "Info", modality_id: "m1", photo: null, members_count: 7, max_members: 10 }

  it("filtra por modalidade, temporada e status aprovado", async () => {
    reply = { data: [team] }
    const result = await listModalityTeams("m1", "s1", signal)
    expect(calls[0].url).toBe("/api/team/")
    expect(calls[0].params).toEqual({ modality_id: "m1", status: "APPROVED", season_id: "s1" })
    expect(result[0].name).toBe("Info")
  })

  it("normaliza contagem ausente para zero", async () => {
    reply = { data: [{ ...team, members_count: null }] }
    expect((await listModalityTeams("m1", undefined, signal))[0].members_count).toBe(0)
    expect(calls[0].params).toEqual({ modality_id: "m1", status: "APPROVED" })
  })
})
