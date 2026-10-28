import { GENDER_MODE_LABELS } from "../constants"
import type { GenderMode, Modality } from "../schemas/modality-schema"

type SizeRule = Pick<Modality, "min_members" | "max_members">
type GenderRule = Pick<Modality, "gender_mode" | "min_male_members" | "min_female_members">

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

export function getGenderModeLabel(mode: GenderMode) {
  return GENDER_MODE_LABELS[mode]
}

export function getTeamSizeLabel({ min_members, max_members }: SizeRule) {
  if (min_members === max_members) return plural(max_members, "jogador", "jogadores")
  return `${min_members} a ${max_members} jogadores`
}

export function getGenderRequirements({ gender_mode, min_male_members, min_female_members }: GenderRule) {
  if (gender_mode !== "MIXED") return []
  const requirements: string[] = []
  if (min_male_members && min_male_members > 0) {
    requirements.push(`mín. ${plural(min_male_members, "homem", "homens")}`)
  }
  if (min_female_members && min_female_members > 0) {
    requirements.push(`mín. ${plural(min_female_members, "mulher", "mulheres")}`)
  }
  return requirements
}
