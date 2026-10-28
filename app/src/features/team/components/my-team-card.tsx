import Link from "next/link"
import { Users } from "lucide-react"
import { Avatar } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import { TEAM_STATUS_LABELS, TEAM_STATUS_VARIANTS } from "../constants"
import type { TeamSummary } from "../schemas/team-schema"
import { getMembersPercent, getTeamCountLabel, getTeamRoleLabel } from "../utils/team-card"

export function MyTeamCard({ team, userId }: { team: TeamSummary; userId?: string }) {
    const role = getTeamRoleLabel(team, userId)

    return (
        <Card className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-start gap-3">
                <Avatar size="lg" name={team.name} src={resolvePhotoSrc(team.photo)} />
                <div className="min-w-0 flex-1">
                    <h3 className="type-section truncate text-ink">{team.name}</h3>
                    <p className="type-body-sm truncate text-muted-foreground">{team.modality_name}</p>
                </div>
                <Badge variant={role === "Dono" ? "dark" : "neutral"}>{role}</Badge>
            </div>
            <div className="mt-auto flex items-end justify-between gap-3">
                <div className="min-w-0 space-y-2">
                    <Badge variant={TEAM_STATUS_VARIANTS[team.status]}>{TEAM_STATUS_LABELS[team.status]}</Badge>
                    <p className="type-body-sm flex items-center gap-1.5 text-muted-foreground">
                        <Users className="size-4" aria-hidden />
                        {getTeamCountLabel(team.members_count, team.max_members)}
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href={`/equipes/${encodeURIComponent(team.team_id)}`}>
                        Abrir<span className="sr-only"> equipe {team.name}</span>
                    </Link>
                </Button>
            </div>
            <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-field">
                <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${getMembersPercent(team.members_count, team.max_members)}%` }}
                />
            </div>
        </Card>
    )
}