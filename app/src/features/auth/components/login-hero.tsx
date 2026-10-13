import { CalendarDays, Medal, Users } from "lucide-react"
import {BrandMark} from "@/features/auth/components/brand-mark";

const HIGHLIGHTS = [
    { icon: CalendarDays, label: "Jogos e horários" },
    { icon: Medal, label: "Tabelas e resultados" },
    { icon: Users, label: "Times e atletas" },
]

function PitchLines() {
    return (
        <svg
            aria-hidden
            viewBox="0 0 400 700"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 size-full text-white opacity-[0.12]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="30" y="30" width="340" height="640" rx="6" />
            <line x1="30" y1="350" x2="370" y2="350" />
            <circle cx="200" cy="350" r="60" />
            <circle cx="200" cy="350" r="4" fill="currentColor" />
            <rect x="110" y="30" width="180" height="90" />
            <rect x="150" y="30" width="100" height="40" />
            <rect x="110" y="580" width="180" height="90" />
            <rect x="150" y="630" width="100" height="40" />
        </svg>
    )
}

// Placar ilustrativo (não são dados reais).
function ScoreCard() {
    return (
        <div aria-hidden className="relative w-full max-w-md">
            <div className="absolute inset-x-6 -bottom-3 h-full rounded-3xl bg-white/25" />
            <div className="relative rounded-3xl bg-white p-5 text-brand-900 shadow-2xl shadow-brand-900/30">
                <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-2 rounded-full bg-red-50 px-2.5 py-1 text-red-600">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            AO VIVO
          </span>
                    <span className="text-brand-700">Futsal · Fase de grupos</span>
                    <span className="tabular-nums text-brand-600">32&apos;</span>
                </div>

                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="flex flex-col items-center gap-2">
            <span className="grid size-14 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
              A
            </span>
                        <span className="text-sm font-semibold">Time A</span>
                    </div>
                    <div className="flex items-center gap-2 text-4xl font-extrabold tabular-nums">
                        <span>2</span>
                        <span className="text-brand-200">–</span>
                        <span>1</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
            <span className="grid size-14 place-items-center rounded-full bg-neutral-100 text-lg font-bold text-neutral-600">
              B
            </span>
                        <span className="text-sm font-semibold">Time B</span>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-brand-100 pt-3 text-[11px] font-medium text-brand-700/80">
                    <span>Exemplo ilustrativo</span>
                    <span>Grupo A · Quadra 2</span>
                </div>
            </div>
        </div>
    )
}

export function LoginHero() {
    return (
        <section className="relative hidden overflow-hidden bg-linear-to-br from-brand-500 via-brand-600 to-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
            <PitchLines />

            <div className="relative">
                <BrandMark tone="light" />
            </div>

            <div className="relative space-y-10">
                <div className="space-y-4">
                    <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                        Acompanhe cada jogo do Intercurso.
                    </h2>
                    <p className="max-w-md text-lg text-brand-100">
                        Tabelas, resultados e times do IFRN reunidos em um só lugar.
                    </p>
                </div>

                <ScoreCard />
            </div>

            <ul className="relative flex flex-wrap gap-3">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                    <li
                        key={label}
                        className="flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-sm"
                    >
                        <Icon className="size-4" aria-hidden />
                        {label}
                    </li>
                ))}
            </ul>
        </section>
    )
}