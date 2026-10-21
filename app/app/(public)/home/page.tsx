import type { Metadata } from "next"
import { Trophy } from "lucide-react"
import { HomeAuthAction } from "@/features/home/components/home-auth-action"
import { HomeCarousel } from "@/features/home/components/home-carousel"
import { HomeHero } from "@/features/home/components/home-hero"
import { HomeShortcuts } from "@/features/home/components/home-shortcuts"
import { ActiveSeasonCard } from "@/features/season/components/active-season-card"

export const metadata: Metadata = {
  title: "Início · Intercurso IFRN",
  description: "Acompanhe jogos, tabelas e resultados do Intercurso do IFRN.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-50">
      <div className="bg-[radial-gradient(700px_circle_at_88%_6%,rgb(47_158_65/0.55),transparent_62%),radial-gradient(620px_circle_at_4%_52%,rgb(31_111_45/0.5),transparent_60%),linear-gradient(165deg,#123f18_0%,#0b2a10_55%,#07200b_100%)] pb-24 text-white">
        <div className="mx-auto w-full max-w-[1120px] px-6">
          <header className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-[14px] bg-lime-accent text-brand-950">
                <Trophy className="size-[22px]" aria-hidden />
              </span>
              <span className="leading-none">
                <span className="block text-[19px] font-bold tracking-tight">
                  Intercurso
                </span>
                <span className="block pt-1 text-[11px] font-semibold tracking-[0.22em] text-brand-200">
                  IFRN
                </span>
              </span>
            </div>
            <HomeAuthAction />
          </header>

          <main>
            <HomeHero />
            <ActiveSeasonCard />
            <HomeCarousel />
          </main>
        </div>
      </div>

      <div className="relative -mt-12 rounded-t-[48px] bg-brand-50 pt-14 text-brand-900">
        <div className="mx-auto w-full max-w-[1120px] px-6">
          <HomeShortcuts />
          <footer className="pb-7 pt-14 text-center text-[13px] text-muted-foreground">
            © Intercurso IFRN
          </footer>
        </div>
      </div>
    </div>
  )
}
