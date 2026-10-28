"use client"

import { useModalities } from "@/features/modality"
import { useActiveSeason } from "@/features/season"
import { PageHeader } from "@/shared/components/page-header"
import { EmptyState, ErrorState, GridSkeleton } from "@/shared/components/request-states"
import { useTeams } from "../hooks/use-teams"
import { TeamCard } from "./team-card"

const LOADING_LABEL = "Carregando times…"

function ModalityTeams({ modalityId, seasonId }: { modalityId: string; seasonId?: string }) {
    const teams = useTeams({ modalityId, seasonId, status: "APPROVED" })
    const modalities = useModalities(seasonId)
    const name =
        modalities.status === "success"
            ? modalities.data.find((modality) => modality.modality_id === modalityId)?.name
            : undefined

    return (
        <div className="space-y-6">
            <PageHeader title={name ? `Times de ${name}` : "Times"} description="Equipes aprovadas nesta modalidade." />
            {teams.status === "loading" && <GridSkeleton label={LOADING_LABEL} />}
            {teams.status === "error" && (
                <ErrorState
                    title="Não foi possível carregar os times."
                    description="Verifique sua conexão e tente novamente."
                    onRetry={teams.retry}
                />
            )}
            {teams.status === "success" && teams.data.length === 0 && (
                <EmptyState title="Nenhum time aprovado ainda." description="Os times aparecem aqui assim que forem aprovados pelo monitor." />
            )}
            {teams.status === "success" && teams.data.length > 0 && (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {teams.data.map((team) => (
                        <li key={team.team_id}>
                            <TeamCard team={team} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export function TeamListView({ modalityId }: { modalityId: string }) {
    const season = useActiveSeason()
    if (season.status === "loading") return <GridSkeleton label={LOADING_LABEL} />

    const seasonId = season.status === "success" ? season.season?.season_id : undefined
    return <ModalityTeams modalityId={modalityId} seasonId={seasonId} />
}
