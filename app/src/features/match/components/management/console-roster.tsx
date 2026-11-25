import { UserX } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/shared/components/ui/avatar"
import { Card, CardHeader } from "@/shared/components/ui/card"
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
    <Card>
      <CardHeader title={team?.name ?? "A definir"} />
      <p className="type-small bg-sunken px-4 py-2 text-muted-foreground">
        {onSelect ? "Toque em um jogador para registrar um evento" : "Registro de eventos indisponível"}
      </p>
      {players.length ? (
        <ul className="divide-y divide-border">
          {players.map((p) => {
            const card = cards.get(p.user_id)
            const expelled = Boolean(card?.expelled)
            return (
              <li key={p.user_id}>
                <button
                  type="button"
                  disabled={!onSelect || expelled}
                  onClick={() => onSelect?.(p)}
                  className="flex min-h-12 w-full items-center gap-2.5 px-4 py-1.5 text-left font-medium outline-none enabled:hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <Avatar size="sm" name={p.name} className={cn(expelled && "opacity-50")} />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate", expelled && "opacity-50")}>{p.name}</span>
                    {expelled && <span className="type-small block text-danger-text">Jogador expulso não pode marcar pontos</span>}
                  </span>
                  {expelled && <UserX className="size-4 shrink-0 text-card-red" aria-label="Expulso" />}
                  {Array.from({ length: card?.yellow ?? 0 }, (_, i) => (
                    <span key={i} role="img" aria-label="Cartão amarelo" className="h-3.5 w-2.5 shrink-0 rounded-[2px] bg-card-yellow" />
                  ))}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="type-small p-4 text-muted-foreground">Elenco não disponível.</p>
      )}
    </Card>
  )
}
