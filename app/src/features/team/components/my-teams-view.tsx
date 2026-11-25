"use client"

import { useState } from "react"
import { Clock, Plus } from "lucide-react"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { getRegistrationState, useActiveSeason, type RegistrationState, type Season } from "@/features/season"
import { PageHeader } from "@/shared/components/page-header"
import { EmptyState, ErrorState, GridSkeleton } from "@/shared/components/request-states"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { useTeams } from "../hooks/use-teams"
import { CreateTeamDialog } from "./create-team-dialog"
import { MyTeamCard } from "./my-team-card"

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
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <PageHeader title="Minhas equipes" description="Gerencie suas equipes e acompanhe a aprovação." />
                {registration.open ? (
                    <Button onClick={() => setCreating(true)}>
                        <Plus aria-hidden /> Criar equipe
                    </Button>
                ) : (
                    <Button disabled aria-describedby={BANNER_ID}>
                        <Plus aria-hidden /> Criar equipe
                    </Button>
                )}
            </div>
            <RegistrationBanner state={registration} />
            {teams.isPending && <GridSkeleton label={LOADING_LABEL} />}
            {teams.isError && (
                <ErrorState
                    title="Não foi possível carregar suas equipes."
                    description="Verifique sua conexão e tente novamente."
                    onRetry={() => teams.refetch()}
                />
            )}
            {teams.isSuccess && teams.data.length === 0 && (
                <EmptyState
                    title="Você ainda não participa de nenhuma equipe."
                    description="Quando você criar ou entrar em uma equipe, ela aparece aqui."
                />
            )}
            {teams.isSuccess && teams.data.length > 0 && (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {teams.data.map((team) => (
                        <li key={team.team_id}>
                            <MyTeamCard team={team} userId={user?.userId} />
                        </li>
                    ))}
                    {registration.open && (
                        <li>
                            <Card
                                asChild
                                className="flex h-full min-h-40 w-full flex-col items-center justify-center gap-1 border-primary-muted bg-primary-soft p-4 text-center text-primary-dark outline-none transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                            >
                                <button type="button" onClick={() => setCreating(true)}>
                                    <Plus className="size-6" aria-hidden />
                                    <span className="type-section">Criar nova equipe</span>
                                    <span className="type-body-sm">Escolha a modalidade e convide a galera</span>
                                </button>
                            </Card>
                        </li>
                    )}
                </ul>
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

    if (season.isPending) return <GridSkeleton label={LOADING_LABEL} />
    if (season.isError) return <MyTeams registration={SEASON_ERROR} />

    return <MyTeams season={season.data} registration={getRegistrationState(season.data, new Date())} />
}