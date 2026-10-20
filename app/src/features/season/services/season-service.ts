import type { Season } from "../schemas/season-schema"

export function pickDefaultSeason(seasons: Season[]) {
  return seasons.find((s) => s.status === "IN_PROGRESS") ?? seasons[0]
}