import { AxiosError, type AxiosResponse } from "axios"
import { describe, expect, it } from "vitest"
import { createSeasonFormSchema } from "../schemas/season-schema"
import { parseCreateSeasonError, validateRulesDocument } from "./create-season"

const year = new Date().getFullYear()
const iso = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 16)
const valid = {
  name: " Intercurso ",
  year: String(year),
  modality_ids: ["m1"],
  open_immediately: false,
  registration_start_date: iso(1),
  registration_end_date: iso(10),
}
const issues = (input: object) =>
  createSeasonFormSchema.safeParse({ ...valid, ...input }).error?.issues.map((issue) => issue.path.join(".")) ?? []

describe("createSeasonFormSchema", () => {
  it("aceita o formulário válido, aparando o nome e convertendo o ano", () => {
    expect(createSeasonFormSchema.parse(valid)).toMatchObject({ name: "Intercurso", year })
  })

  it("valida nome, ano passado e modalidades", () => {
    expect(issues({ name: " ", year: String(year - 1), modality_ids: [] })).toEqual(["name", "year", "modality_ids"])
  })

  it("exige abertura futura, exceto ao abrir imediatamente", () => {
    expect(issues({ registration_start_date: "" })).toEqual(["registration_start_date"])
    expect(issues({ registration_start_date: iso(-1) })).toEqual(["registration_start_date"])
    expect(issues({ registration_start_date: "", open_immediately: true })).toEqual([])
  })

  it("exige encerramento depois da abertura", () => {
    expect(issues({ registration_end_date: "" })).toEqual(["registration_end_date"])
    expect(issues({ registration_end_date: iso(0.5) })).toEqual(["registration_end_date"])
  })
})

describe("validateRulesDocument", () => {
  it("aceita PDF e DOCX até 10 MB", () => {
    expect(validateRulesDocument({ name: "r.pdf", type: "application/pdf", size: 1000 })).toBeNull()
    expect(validateRulesDocument({ name: "r.docx", type: "", size: 1000 })).toBeNull()
  })

  it("recusa outros formatos e arquivos grandes", () => {
    expect(validateRulesDocument({ name: "r.png", type: "image/png", size: 10 })).toContain("PDF ou DOCX")
    expect(validateRulesDocument({ name: "r.pdf", type: "application/pdf", size: 11 * 1024 * 1024 })).toContain("10 MB")
  })
})

describe("parseCreateSeasonError", () => {
  const fail = (status: number, data: unknown = {}) =>
    new AxiosError("x", "ERR", undefined, null, { status, data } as AxiosResponse)

  it("repassa a mensagem do backend em 400 e 409", () => {
    expect(parseCreateSeasonError(fail(409, { error: "Finalize a temporada atual" }))).toBe("Finalize a temporada atual")
    expect(parseCreateSeasonError(fail(400, { error: "Ano inválido" }))).toBe("Ano inválido")
  })

  it("traduz sessão, permissão e falhas genéricas", () => {
    expect(parseCreateSeasonError(fail(401))).toContain("sessão expirou")
    expect(parseCreateSeasonError(fail(403))).toContain("permissão")
    expect(parseCreateSeasonError(new Error("rede"))).toContain("Não foi possível criar")
  })
})
