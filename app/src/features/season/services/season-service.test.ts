import { describe, expect, it } from "vitest"
import type { Season } from "../schemas/season-schema"
import { pickDefaultSeason } from "./season-service"

const season = (id: string, status: Season["status"]): Season => ({
  season_id: id,
  name: id,
  year: 2026,
  status,
  active: true,
})

describe("pickDefaultSeason", () => {
  it("prefere a temporada em andamento e cai para a primeira", () => {
    const list = [season("a", "REGISTRATION_OPEN"), season("b", "IN_PROGRESS")]
    expect(pickDefaultSeason(list)?.season_id).toBe("b")
    expect(pickDefaultSeason(list.slice(0, 1))?.season_id).toBe("a")
    expect(pickDefaultSeason([])).toBeUndefined()
  })
})