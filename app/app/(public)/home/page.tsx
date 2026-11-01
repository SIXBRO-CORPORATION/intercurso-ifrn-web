import type { Metadata } from "next"
import { HomeNavbar } from "@/features/home/components/home-navbar"
import { HomeView } from "@/features/home/components/home-view"

export const metadata: Metadata = {
  title: "Início | Intercurso IFRN",
  description: "Acompanhe jogos, modalidades e resultados do Intercurso do IFRN.",
}

export default function HomePage() {
  return (
    <>
      <HomeNavbar />
      <main className="mx-auto w-full max-w-(--container-public) px-6 pb-16 md:pb-24">
        <HomeView />
      </main>
    </>
  )
}
