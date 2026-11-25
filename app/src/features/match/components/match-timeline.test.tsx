import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { MatchTimeline } from "./match-timeline"

const match = makeMatch({
  timeline: [
    { event_id: "e0", event_type: "MATCH_STARTED", clock_seconds: 0 },
    { event_id: "e1", event_type: "GOAL", clock_seconds: 60, team_id: "t1" },
  ],
})

describe("MatchTimeline", () => {
  it("sem onSelect não há botões (visão pública)", () => {
    render(<MatchTimeline match={match} />)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("com onSelect só eventos corrigíveis são selecionáveis", async () => {
    const onSelect = vi.fn()
    render(<MatchTimeline match={match} onSelect={onSelect} />)

    expect(screen.getAllByRole("button")).toHaveLength(1)
    await userEvent.click(screen.getByRole("button", { name: /Gol/ }))
    expect(onSelect).toHaveBeenCalledWith("e1")
  })
})
