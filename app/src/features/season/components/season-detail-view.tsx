"use client"

import { FileText } from "lucide-react"
import { useModalities } from "@/features/modality"
import { EmptyState, ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { SEASON_STATUS_BADGES } from "../constants"
import { useSeason } from "../hooks/use-seasons"
import { getRegistrationPeriodLabel } from "../utils/registration-period"

export function SeasonDetailView({ id }: { id: string }) {
  const season = useSeason(id)

  if (season.isPending) return <ListSkeleton label="Carregando temporada…" count={2} />
  if (season.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a temporada."
        description="Verifique sua conexão e tente novamente."
        onRetry={() => season.refetch()}
      />
    )
  }

  const data = season.data
  const badge = SEASON_STATUS_BADGES[data.status]

  return (
    <div className="space-y-4">
      <Card className="space-y-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="type-h2 font-semibold">{data.name}</h2>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <p className="type-small text-muted-foreground">
          {data.year} · {getRegistrationPeriodLabel(data)}
        </p>
        {data.rules_document && (
          <Button asChild variant="secondary" size="sm">
            <a href={data.rules_document} target="_blank" rel="noopener noreferrer">
              <FileText aria-hidden />
              Regulamento
            </a>
          </Button>
        )}
      </Card>
      <section className="space-y-2">
        <h3 className="font-semibold">Modalidades</h3>
        <SeasonModalities seasonId={data.season_id} />
      </section>
    </div>
  )
}

function SeasonModalities({ seasonId }: { seasonId: string }) {
  const modalities = useModalities(seasonId)

  if (modalities.isPending) return <ListSkeleton label="Carregando modalidades…" count={2} />
  if (modalities.isError) {
    return <ErrorState title="Não foi possível carregar as modalidades." onRetry={() => modalities.refetch()} />
  }
  if (modalities.data.length === 0) return <EmptyState title="Nenhuma modalidade nesta temporada." />

  return (
    <Card asChild>
      <ul className="divide-y divide-border">
        {modalities.data.map((modality) => (
          <li key={modality.modality_id} className="px-4 py-3 font-medium">
            {modality.name}
          </li>
        ))}
      </ul>
    </Card>
  )
}
