import Link from "next/link"
import { Mars, Users, Venus, VenusAndMars, type LucideIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import type { GenderMode, Modality } from "../schemas/modality-schema"
import { getGenderModeLabel, getGenderRequirements, getTeamSizeLabel } from "../utils/modality-rules"
import { ModalityPhoto } from "./modality-photo"

const GENDER_ICONS: Record<GenderMode, LucideIcon> = {
  MALE: Mars,
  FEMALE: Venus,
  MIXED: VenusAndMars,
}

export function ModalityCard({ modality }: { modality: Modality }) {
  const Icon = GENDER_ICONS[modality.gender_mode]
  const requirements = getGenderRequirements(modality)
  const headingId = `modality-${modality.modality_id}`

  return (
      <Card asChild className="flex h-full flex-col gap-4 p-4">
        <article aria-labelledby={headingId}>
          <header className="flex items-center gap-3">
            <ModalityPhoto
                src={modality.photo}
                className="size-12"
                fallback={
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-dark">
                <Icon className="size-6" />
              </span>
                }
            />
            <div className="min-w-0">
              <h3 id={headingId} className="type-section truncate text-ink">
                {modality.name}
              </h3>
              <p className="type-body-sm text-muted-foreground">{getGenderModeLabel(modality.gender_mode)}</p>
            </div>
          </header>

          <Card variant="field" asChild>
            <dl className="grid grid-cols-2 gap-3 p-3">
              <div>
                <dt className="type-caption text-muted-foreground">Elenco</dt>
                <dd className="type-label mt-0.5 flex items-center gap-1.5 text-ink">
                  <Users className="size-4 text-primary" aria-hidden />
                  {getTeamSizeLabel(modality)}
                </dd>
              </div>
              <div>
                <dt className="type-caption text-muted-foreground">Mín. / Máx.</dt>
                <dd className="type-label mt-0.5 text-ink">
                  {modality.min_members} / {modality.max_members}
                </dd>
              </div>
            </dl>
          </Card>

          {requirements.length > 0 && (
              <ul aria-label="Composição por gênero" className="flex flex-wrap gap-2">
                {requirements.map((requirement) => (
                    <li key={requirement} className="inline-flex h-6 items-center rounded-full bg-primary-soft px-2.5 text-xs font-bold text-primary-dark">
                      {requirement}
                    </li>
                ))}
              </ul>
          )}

          <Button asChild variant="soft" size="sm" className="mt-auto self-start">
            <Link href={`/modalidades/${encodeURIComponent(modality.modality_id)}/times`}>
              <Users aria-hidden /> Ver times
              <span className="sr-only"> de {modality.name}</span>
            </Link>
          </Button>
        </article>
      </Card>
  )
}