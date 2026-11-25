"use client"

import { useState } from "react"
import { Clock, Plus, Shield } from "lucide-react"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { getRegistrationState, useActiveSeason, type RegistrationState, type Season } from "@/features/season"
import { ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/shared/components/ui/empty"
import { TEAM_STATUS_LABELS, TEAM_STATUS_VARIANTS } from "../constants"
import { useTeams } from "../hooks/use-teams"
import { getTeamCountLabel, getTeamRoleLabel } from "../utils/team-card"
import { CreateTeamDialog } from "./create-team-dialog"
import { TeamRow } from "./team-row"

const LOADING_LABEL = "Carregando suas equipes…"
const BANNER_ID = "registration-status"
const SEASON_ERROR: RegistrationState = {
    open: false,
    message: "Não foi possível verificar as inscrições.",
    detail: "Recarregue a página para tentar novamente.",
}

function RegistrationBanner({ state }: { state: RegistrationState }) {
    return (
        <Alert id={BANNER_ID} role="status" variant={state.open ? "success" : "warning"}>
            <Clock aria-hidden />
            <AlertTitle>{state.message}</AlertTitle>
            {state.detail && <AlertDescription>{state.detail}</AlertDescription>}
        </Alert>
    )
}

function MyTeams({ season, registration }: { season?: Season | null; registration: RegistrationState }) {
    const { user } = useAuth()
    const teams = useTeams({ seasonId: season?.season_id })
    const [creating, setCreating] = useState(false)

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    disabled={!registration.open}
                    aria-describedby={registration.open ? undefined : BANNER_ID}
                    onClick={() => setCreating(true)}
                >
                    <Plus aria-hidden /> Criar equipe
                </Button>
            </div>
            <RegistrationBanner state={registration} />
            {teams.isPending && <ListSkeleton label={LOADING_LABEL} />}
            {teams.isError && (
                <ErrorState
                    title="Não foi possível carregar suas equipes."
                    description="Verifique sua conexão e tente novamente."
                    onRetry={() => teams.refetch()}
                />
            )}
            {teams.isSuccess && teams.data.length === 0 && (
                <Empty role="status">
                    <Shield className="size-7 text-muted-foreground" aria-hidden />
                    <EmptyTitle>Você ainda não participa de nenhuma equipe.</EmptyTitle>
                    <EmptyDescription>Quando você criar ou entrar em uma equipe, ela aparece aqui.</EmptyDescription>
                </Empty>
            )}
            {teams.isSuccess && teams.data.length > 0 && (
                <Card asChild>
                    <ul className="divide-y divide-border">
                        {teams.data.map((team) => (
                            <TeamRow
                                key={team.team_id}
                                team={team}
                                detail={[team.modality_name, getTeamCountLabel(team.members_count, team.max_members)].filter(Boolean).join(" · ")}
                            >
                                <Badge className="h-6">{getTeamRoleLabel(team, user?.userId)}</Badge>
                                <Badge variant={TEAM_STATUS_VARIANTS[team.status]}>{TEAM_STATUS_LABELS[team.status]}</Badge>
                            </TeamRow>
                        ))}
                    </ul>
                </Card>
            )}
            {creating && season && (
                <CreateTeamDialog
                    season={season}
                    takenModalityIds={teams.data?.map((team) => team.modality_id) ?? []}
                    onClose={() => setCreating(false)}
                />
            )}
        </div>
    )
}

export function MyTeamsView() {
    const season = useActiveSeason()

    if (season.isPending) return <ListSkeleton label={LOADING_LABEL} />
    if (season.isError) return <MyTeams registration={SEASON_ERROR} />

    return <MyTeams season={season.data} registration={getRegistrationState(season.data, new Date())} />
}
