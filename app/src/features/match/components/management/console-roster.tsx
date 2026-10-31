import { Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import { Avatar } from "@/shared/components/ui/avatar"
import { Card } from "@/shared/components/ui/card"
import type { MatchDetail, MatchTeam } from "../../types/match"
import type { playerCards } from "../../utils/match-timeline"

type Props = {
  team: MatchTeam | null
  players: MatchDetail["team1_players"]
  cards: ReturnType<typeof playerCards>
}

export function ConsoleRoster({ team, players, cards }: Props) {
  return (
    <Card className="overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border p-4">
        <Avatar name={team?.name} src={resolvePhotoSrc(team?.photo)} />
        <div className="min-w-0">
          <h2 className="type-section truncate text-ink">{team?.name ?? "A definir"}</h2>
          <p className="type-caption text-muted-foreground">{players.length} jogadores</p>
        </div>
      </header>
      {players.length ? (
        <ul className="space-y-1 p-2">
          {players.map((p) => {
            const card = cards.get(p.user_id)
            return (
              <li key={p.user_id}>
                <button
                  type="button"
                  disabled
                  className={cn("type-body flex w-full items-center gap-3 rounded-md px-3 py-3 text-left font-medium text-ink", card?.red && "opacity-50")}
                >
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  {card && (card.yellow > 0 || card.red) && (
                    <span className="flex shrink-0 gap-1">
                      {Array.from({ length: card.yellow }, (_, i) => (
                        <Square key={i} className="size-4 fill-warning text-warning" aria-label="Cartão amarelo" />
                      ))}
                      {card.red && <Square className="size-4 fill-danger text-danger" aria-label="Cartão vermelho" />}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="type-body-sm p-4 text-muted-foreground">Elenco não disponível.</p>
      )}
    </Card>
  )
}
