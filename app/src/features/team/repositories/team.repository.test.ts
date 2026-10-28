import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it } from "vitest"
import { api } from "@/lib/axios"
import { listTeams } from "./team-repository"

const team = { team_id: "t1", name: "Info", modality_id: "m1", status: "APPROVED", photo: null, members_count: 7, max_members: 10 }

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

describe("listTeams", () => {
    it("traduz os filtros para a query da API", async () => {
        reply = { data: [team] }
        const result = await listTeams({ modalityId: "m1", seasonId: "s1", status: "APPROVED" }, signal)
        expect(calls[0].url).toBe("/api/team/")
        expect(calls[0].params).toEqual({ modality_id: "m1", season_id: "s1", status: "APPROVED" })
        expect(result[0].name).toBe("Info")
    })

    it("omite filtros ausentes", async () => {
        reply = { data: [] }
        await listTeams({ modalityId: "m1" }, signal)
        expect(calls[0].params).toEqual({ modality_id: "m1" })
    })

    it("normaliza contagem ausente para zero e aceita data nulo", async () => {
        reply = { data: [{ ...team, members_count: null }] }
        expect((await listTeams({}, signal))[0].members_count).toBe(0)
        reply = { data: null }
        expect(await listTeams({}, signal)).toEqual([])
    })

    it("rejeita resposta fora do contrato", async () => {
        reply = { data: [{ name: "sem id" }] }
        await expect(listTeams({}, signal)).rejects.toThrow()
    })

    it("repassa erros de rede/HTTP", async () => {
        status = 403
        await expect(listTeams({}, signal)).rejects.toThrow()
    })
})
