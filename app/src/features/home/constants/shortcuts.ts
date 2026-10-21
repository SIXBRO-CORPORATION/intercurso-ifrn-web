import { CalendarDays, Medal, type LucideIcon } from "lucide-react"

export type HomeShortcut = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export const HOME_SHORTCUTS: HomeShortcut[] = [
  {
    href: "/partidas",
    label: "Partidas",
    description: "Jogos ao vivo, agendados e finalizados.",
    icon: CalendarDays,
  },
  {
    href: "/modalidades",
    label: "Modalidades",
    description: "Esportes, classificação e chaveamento.",
    icon: Medal,
  },
]
