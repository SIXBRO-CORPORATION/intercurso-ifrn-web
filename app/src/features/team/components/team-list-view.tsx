"use client"

import { useModalities } from "@/features/modality"
import { useActiveSeason } from "@/features/season"
import { EmptyState, ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { Card, CardHeader } from "@/shared/components/ui/card"
import { useTeams } from "../hooks/use-teams"
import { getTeamCountLabel } from "../utils/team-card"
import { TeamRow } from "./team-row"

const LOADING_LABEL = "Carregando times…"

function ModalityTeams({ modalityId, seasonId }: { modalityId: string; seasonId?: string }) {
    const teams = useTeams({ modalityId, seasonId, status: "APPROVED" })
    const modalities = useModalities(seasonId)
    const name = modalities.data?.find((modality) => modality.modality_id === modalityId)?.name

    if (teams.isPending) return <ListSkeleton label={LOADING_LABEL} />
    if (teams.isError) {
        return (
            <ErrorState
                title="Não foi possível carregar os times."
                description="Verifique sua conexão e tente novamente."
                onRetry={() => teams.refetch()}
            />
        )
    }
    if (teams.data.length === 0) {
        return <EmptyState title="Nenhum time aprovado ainda." description="Os times aparecem aqui assim que forem aprovados pelo monitor." />
    }

    return (
        <Card>
            <CardHeader title={name ? `Times de ${name}` : "Times aprovados"} />
            <ul className="divide-y divide-border">
                {teams.data.map((team) => (
                    <TeamRow key={team.team_id} team={team} detail={getTeamCountLabel(team.members_count, team.max_members)} />
                ))}
            </ul>
        </Card>
    )
}

export function TeamListView({ modalityId }: { modalityId: string }) {
    const season = useActiveSeason()
    if (season.isPending) return <ListSkeleton label={LOADING_LABEL} />

    const seasonId = season.data?.season_id
    return <ModalityTeams modalityId={modalityId} seasonId={seasonId} />
}
