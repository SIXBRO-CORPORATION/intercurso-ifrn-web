import Link from "next/link"
import { href } from "@/core/routes/route-registry"
import { ChevronRight, Mars, Venus, VenusAndMars, type LucideIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import type { GenderMode, Modality } from "../schemas/modality-schema"
import { getGenderModeLabel, getGenderRequirements, getTeamSizeLabel } from "../utils/modality-rules"

const GENDER_ICONS: Record<GenderMode, LucideIcon> = {
  MALE: Mars,
  FEMALE: Venus,
  MIXED: VenusAndMars,
}

export function ModalityCard({ modality }: { modality: Modality }) {
  const Icon = GENDER_ICONS[modality.gender_mode]
  const requirements = getGenderRequirements(modality)
  const photo = resolvePhotoSrc(modality.photo)
  const headingId = `modality-${modality.modality_id}`

  return (
    <article aria-labelledby={headingId} className="flex min-h-15 flex-wrap items-center gap-3 px-4 py-2">
      <Avatar size="sm">
        {photo && <AvatarImage src={photo} />}
        <AvatarFallback>
          <Icon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-40 flex-1">
        <h2 id={headingId} className="truncate font-semibold">
          {modality.name}
        </h2>
        <p className="type-small text-muted-foreground">
          {getGenderModeLabel(modality.gender_mode)} · {getTeamSizeLabel(modality)}
        </p>
      </div>
      {requirements.length > 0 && (
        <ul aria-label="Composição por gênero" className="flex flex-wrap gap-1.5">
          {requirements.map((requirement) => (
            <li key={requirement}>
              <Badge>{requirement}</Badge>
            </li>
          ))}
        </ul>
      )}
      <Button asChild variant="ghost" size="sm" className="ml-auto">
        <Link href={href("modalityTeams", { id: modality.modality_id })}>
          Ver times
          <span className="sr-only"> de {modality.name}</span>
          <ChevronRight aria-hidden />
        </Link>
      </Button>
    </article>
  )
}
