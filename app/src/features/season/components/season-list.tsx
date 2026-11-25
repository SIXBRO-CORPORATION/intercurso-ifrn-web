"use client"

import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"
import { href } from "@/core/routes/route-registry"
import { EmptyState, ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { SEASON_STATUS_BADGES } from "../constants"
import { useSeasons } from "../hooks/use-seasons"
import { getRegistrationPeriodLabel } from "../utils/registration-period"

export function SeasonList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href={href("seasonCreate")}>
            <Plus aria-hidden />
            Nova temporada
          </Link>
        </Button>
      </div>
      <SeasonListContent />
    </div>
  )
}

function SeasonListContent() {
  const seasons = useSeasons()

  if (seasons.isPending) return <ListSkeleton label="Carregando temporadas…" />
  if (seasons.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar as temporadas."
        description="Verifique sua conexão e tente novamente."
        onRetry={() => seasons.refetch()}
      />
    )
  }
  if (seasons.data.length === 0) {
    return <EmptyState title="Nenhuma temporada cadastrada." description="As temporadas criadas aparecem aqui." />
  }

  return (
    <Card asChild>
      <ul className="divide-y divide-border">
        {seasons.data.map((season) => {
          const badge = SEASON_STATUS_BADGES[season.status]
          return (
            <li key={season.season_id}>
              <Link
                href={href("season", { id: season.season_id })}
                className="flex min-h-15 items-center gap-3 px-4 py-2 hover:bg-muted"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {season.name} <span className="text-muted-foreground">· {season.year}</span>
                  </p>
                  <p className="type-small text-muted-foreground">{getRegistrationPeriodLabel(season)}</p>
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
                <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
              </Link>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
