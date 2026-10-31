import { Square, UserX } from "lucide-react"
import { cn } from "@/lib/utils"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import { Avatar } from "@/shared/components/ui/avatar"
import { Card } from "@/shared/components/ui/card"
import type { MatchDetail, MatchPlayer, MatchTeam } from "../../types/match"
import type { playerCards } from "../../utils/match-timeline"

type Props = {
  team: MatchTeam | null
  players: MatchDetail["team1_players"]
  cards: ReturnType<typeof playerCards>
  onSelect?: (player: MatchPlayer) => void
}

export function ConsoleRoster({ team, players, cards, onSelect }: Props) {
  return (
    <Card className="overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border p-4">
        <Avatar name={team?.name} src={resolvePhotoSrc(team?.photo)} />
        <div className="min-w-0">
          <h2 className="type-section truncate text-ink">{team?.name ?? "A definir"}</h2>
          <p className="type-caption text-muted-foreground">
            {onSelect ? "Toque em um jogador para registrar" : `${players.length} jogadores`}
          </p>
        </div>
      </header>
      {players.length ? (
        <ul className="space-y-1 p-2">
          {players.map((p) => {
            const card = cards.get(p.user_id)
            const expelled = Boolean(card?.red)
            return (
              <li key={p.user_id}>
                <button
                  type="button"
                  disabled={!onSelect || expelled}
                  onClick={() => onSelect?.(p)}
                  className="type-body flex w-full items-center gap-3 rounded-md px-3 py-3 text-left font-medium text-ink outline-none transition-colors enabled:hover:bg-field focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-default"
                >
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate", expelled && "opacity-50 grayscale")}>{p.name}</span>
                    {expelled && <span className="type-caption block text-danger">Jogador expulso não pode marcar pontos</span>}
                  </span>
                  {expelled && <UserX className="size-5 shrink-0 text-danger" aria-label="Expulso" />}
                  {card && card.yellow > 0 && (
                    <span className={cn("flex shrink-0 gap-1", expelled && "opacity-50")}>
                      {Array.from({ length: card.yellow }, (_, i) => (
                        <Square key={i} className="size-4 fill-warning text-warning" aria-label="Cartão amarelo" />
                      ))}
                    </span>
                  )}
                  {card?.red && !expelled && <Square className="size-4 fill-danger text-danger" aria-label="Cartão vermelho" />}
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
