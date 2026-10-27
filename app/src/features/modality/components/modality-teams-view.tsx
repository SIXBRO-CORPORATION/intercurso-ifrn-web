"use client"

import { useActiveSeason } from "@/features/season"
import { PageHeader } from "@/shared/components/page-header"
import { useModalities } from "../hooks/use-modalities"
import { useModalityTeams } from "../hooks/use-modality-teams"
import { ModalityListLoading, ModalityMessage } from "./modality-list-states"
import { ModalityTeamCard } from "./modality-team-card"

function ModalityTeams({ modalityId, seasonId }: { modalityId: string; seasonId?: string }) {
  const teams = useModalityTeams(modalityId, seasonId)
  const modalities = useModalities(seasonId)
  const name =
      modalities.status === "success"
          ? modalities.data.find((modality) => modality.modality_id === modalityId)?.name
          : undefined

  return (
      <div className="space-y-6">
        <PageHeader
            title={name ? `Times de ${name}` : "Times"}
            description="Equipes aprovadas nesta modalidade."
        />
        {teams.status === "loading" && <ModalityListLoading label="Carregando times…" />}
        {teams.status === "error" && (
            <ModalityMessage alert title="Não foi possível carregar os times." onRetry={teams.retry}>
              Verifique sua conexão e tente novamente.
            </ModalityMessage>
        )}
        {teams.status === "success" && teams.data.length === 0 && (
            <ModalityMessage title="Nenhum time aprovado ainda.">
              Os times aparecem aqui assim que forem aprovados pelo monitor.
            </ModalityMessage>
        )}
        {teams.status === "success" && teams.data.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.data.map((team) => (
                  <li key={team.team_id}>
                    <ModalityTeamCard team={team} />
                  </li>
              ))}
            </ul>
        )}
      </div>
  )
}

export function ModalityTeamsView({ modalityId }: { modalityId: string }) {
  const season = useActiveSeason()
  if (season.status === "loading") return <ModalityListLoading label="Carregando times…" />

  const seasonId = season.status === "success" ? season.season?.season_id : undefined
  return <ModalityTeams modalityId={modalityId} seasonId={seasonId} />
}
