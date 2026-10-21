import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Placar ilustrativo (não são dados reais), como o da tela de login.
function ScoreCard() {
  return (
    <div
      aria-hidden
      className="w-full max-w-[470px] flex-[1_1_340px] rounded-4xl border border-white/15 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <span className="flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1.5 text-red-200">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          AO VIVO
        </span>
        <span className="font-medium text-white/80">Futsal · Fase de grupos</span>
        <span className="tabular-nums text-lime-accent">32&apos;</span>
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <div className="flex flex-1 flex-col items-center gap-2.5">
          <span className="grid size-[72px] place-items-center rounded-[22px] bg-linear-to-br from-brand-500 to-brand-900 text-3xl font-extrabold text-white">
            A
          </span>
          <span className="text-sm font-semibold text-white">Time A</span>
        </div>
        <div className="flex items-center gap-2.5 text-5xl font-extrabold tabular-nums tracking-tight text-white">
          <span>2</span>
          <span className="text-white/35">–</span>
          <span>1</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2.5">
          <span className="grid size-[72px] place-items-center rounded-[22px] bg-linear-to-br from-brand-100 to-brand-200 text-3xl font-extrabold text-brand-950">
            B
          </span>
          <span className="text-sm font-semibold text-white">Time B</span>
        </div>
      </div>

      <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-4 text-sm text-white/90">
        <li className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-lime-accent text-[13px] font-extrabold text-brand-950">
            9
          </span>
          <span className="flex-1">Gol · Atleta 9, Time A</span>
          <span className="tabular-nums text-white/70">30&apos;</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-white/15 text-[13px] font-extrabold text-white">
            7
          </span>
          <span className="flex-1">Gol · Atleta 7, Time B</span>
          <span className="tabular-nums text-white/70">18&apos;</span>
        </li>
      </ul>

      <p className="mt-4 text-xs text-white/65">Exemplo ilustrativo</p>
    </div>
  )
}

export function HomeHero() {
  return (
    <section className="flex flex-wrap items-center gap-x-14 gap-y-12 pb-12 pt-10">
      <div className="min-w-0 flex-[1_1_480px]">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-[13px] font-medium text-white/85 backdrop-blur-xl">
          <span className="size-2 rounded-full bg-lime-accent" aria-hidden />
          Acesso livre, sem precisar entrar
        </p>
        <h1 className="mt-5 max-w-[640px] text-[clamp(2.375rem,8.6vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-white">
          Acompanhe <span className="text-lime-accent">cada jogo</span> do
          Intercurso.
        </h1>
        <p className="mt-5 max-w-[480px] text-lg leading-relaxed text-white/80">
          Tabelas, resultados e times do IFRN reunidos em um só lugar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/partidas"
            className="inline-flex h-[52px] items-center gap-2.5 rounded-full bg-lime-accent px-6 text-base font-bold text-brand-950 outline-none transition-colors hover:bg-lime-accent/90 focus-visible:ring-3 focus-visible:ring-lime-accent/50"
          >
            Ver partidas
            <ArrowRight className="size-[18px]" aria-hidden />
          </Link>
          <Link
            href="/modalidades"
            className="inline-flex h-[52px] items-center rounded-full border border-white/15 bg-white/8 px-6 text-base font-semibold text-white outline-none backdrop-blur-xl transition-colors hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-lime-accent/50"
          >
            Modalidades
          </Link>
        </div>
      </div>

      <ScoreCard />
    </section>
  )
}
