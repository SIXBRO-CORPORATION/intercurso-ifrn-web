import type { ReactNode } from "react"
import { Avatar } from "@/shared/components/ui/avatar"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import type { TeamSummary } from "../schemas/team-schema"

export function TeamRow({ team, detail, children }: { team: TeamSummary; detail: string; children?: ReactNode }) {
    return (
        <li className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-2">
            <Avatar name={team.name} src={resolvePhotoSrc(team.photo)} />
            <div className="min-w-35 flex-1">
                <h2 className="truncate font-semibold">{team.name}</h2>
                <p className="type-small text-text-secondary">{detail}</p>
            </div>
            {children}
        </li>
    )
}
