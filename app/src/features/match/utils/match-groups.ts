import type { Match } from "../types/match"

export type ModalityOption = { id: string; name: string }
export type ModalityGroup = { modality_id: string; name: string; matches: Match[] }

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "pt-BR")

export function splitLive(items: Match[]) {
  return {
    live: items.filter((m) => m.status === "IN_PROGRESS"),
    rest: items.filter((m) => m.status !== "IN_PROGRESS"),
  }
}

export function groupByModality(items: Match[]): ModalityGroup[] {
  const groups = new Map<string, ModalityGroup>()
  for (const match of items) {
    const group = groups.get(match.modality_id)
    if (group) group.matches.push(match)
    else groups.set(match.modality_id, { modality_id: match.modality_id, name: match.modality_name, matches: [match] })
  }
  return [...groups.values()].sort(byName)
}

export function modalityOptions(items: Match[]): ModalityOption[] {
  const options = new Map<string, ModalityOption>()
  for (const m of items) options.set(m.modality_id, { id: m.modality_id, name: m.modality_name })
  return [...options.values()].sort(byName)
}
