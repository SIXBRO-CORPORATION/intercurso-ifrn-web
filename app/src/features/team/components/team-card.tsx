import { Avatar } from "@/shared/components/ui/avatar"
import { Card } from "@/shared/components/ui/card"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import type { TeamSummary } from "../schemas/team-schema"
import { getTeamCountLabel } from "../utils/team-card"

export function TeamCard({ team }: { team: TeamSummary }) {
    return (
        <Card className="flex items-center gap-3 p-4">
            <Avatar name={team.name} src={resolvePhotoSrc(team.photo)} />
            <div className="min-w-0">
                <p className="type-section truncate text-ink">{team.name}</p>
                <p className="type-body-sm text-muted-foreground">{getTeamCountLabel(team.members_count, team.max_members)}</p>
            </div>
        </Card>
    )
}
