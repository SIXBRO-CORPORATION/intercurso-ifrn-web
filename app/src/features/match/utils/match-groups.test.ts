import { describe, expect, it } from "vitest"
import { matchSchema } from "../schemas/match-schema"
import { groupByModality, modalityOptions, splitLive } from "./match-groups"

const make = (id: string, modality_id: string, modality_name: string, status = "SCHEDULED") =>
  matchSchema.parse({
    match_id: id, bracket_id: null, modality_id, modality_name, group_name: null, match_type: null,
    match_category: null, status, scheduled_date: null, team1: null, team2: null, winner_id: null,
    clock_seconds: null, clock_running: false, current_period: null,
  })

const items = [make("1", "v", "Vôlei"), make("2", "f", "Futsal", "IN_PROGRESS"), make("3", "v", "Vôlei", "FINISHED"), make("4", "f", "Futsal")]

describe("splitLive", () => {
  it("separa partidas em andamento das demais", () => {
    const { live, rest } = splitLive(items)
    expect(live.map((m) => m.match_id)).toEqual(["2"])
    expect(rest.map((m) => m.match_id)).toEqual(["1", "3", "4"])
  })
})

describe("groupByModality", () => {
  it("agrupa por modalidade, em ordem alfabética, preservando a ordem das partidas", () => {
    const groups = groupByModality(items)
    expect(groups.map((g) => g.name)).toEqual(["Futsal", "Vôlei"])
    expect(groups[1].matches.map((m) => m.match_id)).toEqual(["1", "3"])
  })
})

describe("modalityOptions", () => {
  it("devolve modalidades únicas ordenadas por nome", () => {
    expect(modalityOptions(items)).toEqual([{ id: "f", name: "Futsal" }, { id: "v", name: "Vôlei" }])
  })
})
