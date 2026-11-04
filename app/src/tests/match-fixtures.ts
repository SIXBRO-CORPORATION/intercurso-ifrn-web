import type { MatchDetail } from "@/features/match/types/match"

type Options = {
  score?: [number, number]
  setsWon?: [number, number]
  sets?: MatchDetail["sets"]
}

export function makeMatch({ score = [0, 0], setsWon = [0, 0], sets = [] }: Options = {}): MatchDetail {
  return {
    match_id: "m1",
    bracket_id: null,
    modality_id: "mod",
    modality_name: "Vôlei",
    group_name: null,
    match_type: null,
    match_category: null,
    status: "IN_PROGRESS",
    scheduled_date: null,
    team1: { team_id: "t1", name: "Falcões", photo: null, score: score[0], sets_won: setsWon[0] },
    team2: { team_id: "t2", name: "Tigres", photo: null, score: score[1], sets_won: setsWon[1] },
    winner_id: null,
    clock_seconds: null,
    clock_running: false,
    current_period: null,
    modality_configuration: { sets_to_win: 3 },
    sets,
    team1_players: [],
    team2_players: [],
    timeline: [],
  }
}

export function finishedSets(total: number): MatchDetail["sets"] {
  return Array.from({ length: total }, (_, i) => ({ set_number: i + 1, team1_points: 25, team2_points: 20 }))
}
