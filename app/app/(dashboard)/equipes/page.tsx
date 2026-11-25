import type { Metadata } from "next"
import { MyTeamsView } from "@/features/team/components/my-teams-view"

export const metadata: Metadata = { title: "Minhas equipes | Intercurso IFRN" }

export default function EquipesPage() {
    return <MyTeamsView />
}
