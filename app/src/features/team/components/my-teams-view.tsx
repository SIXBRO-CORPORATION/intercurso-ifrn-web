"use client"

import Link from "next/link"
import { Clock, Plus } from "lucide-react"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { getRegistrationState, useActiveSeason, type RegistrationState } from "@/features/season"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/shared/components/page-header"
import { EmptyState, ErrorState, GridSkeleton } from "@/shared/components/request-states"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { NEW_TEAM_PATH } from "../constants"
import { useTeams } from "../hooks/use-teams"
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
        <div
            id={BANNER_ID}
            role="status"
            className={cn(
                "flex items-start gap-3 rounded-lg p-4",
                state.open ? "bg-primary-soft text-primary-dark" : "bg-warning-soft text-warning-text",
            )}
        >
            <Clock className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
                <p className="type-section">{state.message}</p>
                {state.detail && <p className="type-body-sm">{state.detail}</p>}
            </div>
        </div>
    )
}

function MyTeams({ seasonId, registration }: { seasonId?: string; registration: RegistrationState }) {
    const { user } = useAuth()
    const teams = useTeams({ seasonId })

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <PageHeader title="Minhas equipes" description="Gerencie suas equipes e acompanhe a aprovação." />
                {registration.open ? (
                    <Button asChild>
                        <Link href={NEW_TEAM_PATH}>
                            <Plus aria-hidden /> Criar equipe
                        </Link>
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
            {teams.status === "success" && teams.data.length === 0 && (
                <EmptyState
                    title="Você ainda não participa de nenhuma equipe."
                    description="Quando você criar ou entrar em uma equipe, ela aparece aqui."
                />
            )}
            {teams.status === "success" && (teams.data.length > 0 || registration.open) && (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {teams.data.map((team) => (
                        <li key={team.team_id}>
                            <MyTeamCard team={team} userId={user?.userId} />
                        </li>
                    ))}
                    {registration.open && teams.data.length > 0 && (
                        <li>
                            <Card
                                asChild
                                className="flex h-full min-h-40 flex-col items-center justify-center gap-1 border-primary-muted bg-primary-soft p-4 text-center text-primary-dark outline-none transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                            >
                                <Link href={NEW_TEAM_PATH}>
                                    <Plus className="size-6" aria-hidden />
                                    <span className="type-section">Criar nova equipe</span>
                                    <span className="type-body-sm">Escolha a modalidade e convide a galera</span>
                                </Link>
                            </Card>
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}



export function MyTeamsView() {
    const season = useActiveSeason()

    if (season.isPending) {
        return <GridSkeleton label={LOADING_LABEL} />
    }

    if (season.isError) {
        return <MyTeams registration={SEASON_ERROR} />
    }

    const activeSeason = season.data

    return (
        <MyTeams
            seasonId={activeSeason?.season_id}
            registration={getRegistrationState(activeSeason, new Date())}
        />
    )
}
