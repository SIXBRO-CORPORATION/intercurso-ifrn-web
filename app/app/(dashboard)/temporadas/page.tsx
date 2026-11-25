import type { Metadata } from "next"
import { SeasonList } from "@/features/season/components/season-list"

export const metadata: Metadata = { title: "Temporadas | Intercurso IFRN" }

export default function SeasonsPage() {
  return <SeasonList />
}
