import { CalendarDays } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { SEASON_STATUS } from "@/features/season/constants"
import type { Season } from "@/features/season/schemas/season-schema"
import { formatRegistrationPeriod } from "@/features/season/utils/format-registration-period"

export function HomeSeasonLoading() {
  return (
    <div role="status" aria-busy="true" className="space-y-4">
      <span className="sr-only">Carregando temporada…</span>
      <div aria-hidden className="space-y-4">
        <div className="h-6 w-32 rounded-full bg-border/60 motion-safe:animate-pulse" />
        <div className="h-12 w-3/4 max-w-lg rounded-md bg-border/60 motion-safe:animate-pulse" />
        <div className="h-5 w-56 rounded-md bg-border/60 motion-safe:animate-pulse" />
      </div>
    </div>
  )
}

export function HomeSeasonError() {
  return (
    <Card role="alert" className="flex flex-col items-start gap-3 border-transparent bg-danger-soft p-6">
      <p className="type-section text-danger">Não foi possível carregar a temporada.</p>
      <p className="type-body-sm text-muted-foreground">Verifique sua conexão e tente novamente.</p>
      <Button variant="danger" size="sm" onClick={() => window.location.reload()}>
        Tentar novamente
      </Button>
    </Card>
  )
}

export function HomeSeasonEmpty() {
  return (
    <Card role="status" className="space-y-1 p-6">
      <p className="type-section text-ink">Nenhuma temporada ativa no momento.</p>
      <p className="type-body-sm text-muted-foreground">Volte em breve: assim que o Intercurso começar, os jogos aparecem aqui.</p>
    </Card>
  )
}

export function HomeSeasonSuccess({ season }: { season: Season }) {
  const status = SEASON_STATUS[season.status]
  const period = formatRegistrationPeriod(season.registration_start_date, season.registration_end_date)

  return (
    <div className="space-y-4">
      <Badge variant={status.variant}>{status.label}</Badge>
      <h1 className="type-h1 text-ink md:type-display">{season.name}</h1>
      {period && (
        <p className="type-body flex items-center gap-2 text-text-secondary">
          <CalendarDays className="size-5 shrink-0 text-primary-dark" aria-hidden />
          <span>
            Inscrições: <span className="font-bold text-ink">{period}</span>
          </span>
        </p>
      )}
    </div>
  )
}
