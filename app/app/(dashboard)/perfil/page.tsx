import type { Metadata } from "next"
import { ProfileView } from "@/features/shell/components/profile-view"

export const metadata: Metadata = { title: "Perfil | Intercurso IFRN" }

export default function PerfilPage() {
  return <ProfileView />
}
