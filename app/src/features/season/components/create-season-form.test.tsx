import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CreateSeasonForm } from "./create-season-form"

const push = vi.fn()
const mutate = vi.fn()
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }))
vi.mock("@/features/modality", () => ({
  useAllModalities: () => ({
    isPending: false,
    isError: false,
    data: [
      { modality_id: "m1", name: "Futsal", active: true },
      { modality_id: "m2", name: "Xadrez", active: false },
    ],
  }),
}))
vi.mock("../hooks/use-seasons", () => ({ useCreateSeason: () => ({ mutate, isPending: false, isError: false }) }))

const local = (days: number) => {
  const date = new Date(Date.now() + days * 86_400_000)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

describe("CreateSeasonForm", () => {
  beforeEach(() => {
    push.mockReset()
    mutate.mockReset()
  })

  it("mostra só modalidades ativas e bloqueia envio inválido", async () => {
    render(<CreateSeasonForm />)
    expect(screen.queryByText("Xadrez")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Criar temporada" }))
    expect(await screen.findByText("Informe o nome da temporada.")).toBeTruthy()
    expect(screen.getByText("Selecione ao menos uma modalidade.")).toBeTruthy()
    expect(mutate).not.toHaveBeenCalled()
  })

  it("envia com abertura imediata e redireciona ao detalhe", async () => {
    mutate.mockImplementation((_values, options) => options.onSuccess({ season_id: "s9" }))
    render(<CreateSeasonForm />)
    await userEvent.type(screen.getByLabelText(/Nome/), "Intercurso 2027")
    await userEvent.click(screen.getByLabelText("Futsal"))
    await userEvent.click(screen.getByLabelText("Abrir inscrições imediatamente"))
    expect((screen.getByLabelText(/Abertura das inscrições/) as HTMLInputElement).disabled).toBe(true)
    await userEvent.type(screen.getByLabelText(/Encerramento das inscrições/), local(10))
    await userEvent.click(screen.getByRole("button", { name: "Criar temporada" }))

    expect(mutate.mock.calls[0][0]).toMatchObject({ name: "Intercurso 2027", modality_ids: ["m1"], open_immediately: true, rules_document: null })
    expect(push).toHaveBeenCalledWith("/temporadas/s9")
  })

  it("recusa regulamento em formato inválido", async () => {
    render(<CreateSeasonForm />)
    const input = screen.getByLabelText(/Regulamento/)
    await userEvent.upload(input, new File(["x"], "r.png", { type: "image/png" }), { applyAccept: false })
    expect(screen.getByText("Envie o regulamento em PDF ou DOCX.")).toBeTruthy()
  })
})
