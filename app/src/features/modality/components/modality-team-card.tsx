import { Avatar } from "@/shared/components/ui/avatar"
import { Card } from "@/shared/components/ui/card"
import type { ModalityTeam } from "../schemas/modality-team-schema"
import { getTeamCountLabel } from "../utils/modality-rules"
import { ModalityPhoto } from "./modality-photo"

export function ModalityTeamCard({ team }: { team: ModalityTeam }) {
    return (
        <Card className="flex items-center gap-3 p-4">
            <ModalityPhoto src={team.photo} className="size-10" fallback={<Avatar name={team.name} />} />
            <div className="min-w-0">
                <p className="type-section truncate text-ink">{team.name}</p>
                <p className="type-body-sm text-muted-foreground">{getTeamCountLabel(team.members_count, team.max_members)}</p>
            </div>
        </Card>
    )
}
