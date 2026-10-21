export type ActiveSeason = {
  id: string
  name: string
  year: number
  status: string
  registrationStartDate: Date | null
  registrationEndDate: Date | null
}

export type ActiveSeasonOutcome =
  | { kind: "success"; season: ActiveSeason }
  | { kind: "none" }
  | { kind: "error" }

export type ActiveSeasonState = { kind: "loading" } | ActiveSeasonOutcome
