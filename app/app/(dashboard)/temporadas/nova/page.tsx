import type { Metadata } from "next"
import { CreateSeasonForm } from "@/features/season/components/create-season-form"

export const metadata: Metadata = { title: "Criar temporada | Intercurso IFRN" }

export default function CreateSeasonPage() {
  return <CreateSeasonForm />
}
