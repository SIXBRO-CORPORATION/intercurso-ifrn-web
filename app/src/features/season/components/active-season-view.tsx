import { CalendarX, CircleAlert, RefreshCw } from "lucide-react"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { ACTIVE_SEASON_MESSAGES, SEASON_STATUS_LABELS } from "../constants"
import type { ActiveSeasonState } from "../types/season"
import { formatRegistrationPeriod } from "../utils/format-registration-period"

// Pensado para fundo escuro (a home): vidro translúcido com texto claro.
const CARD_CLASS =
  "rounded-[28px] border border-white/15 bg-white/8 px-7 py-6 backdrop-blur-xl"

type ActiveSeasonViewProps = {
  state: ActiveSeasonState
  onRetry: () => void
}

export function ActiveSeasonView({ state, onRetry }: ActiveSeasonViewProps) {
  if (state.kind === "loading") {
    return (
      <section
        role="status"
        aria-busy="true"
        aria-label="Temporada atual"
        className={`${CARD_CLASS} flex flex-wrap items-center gap-x-10 gap-y-5`}
      >
        <span className="sr-only">{ACTIVE_SEASON_MESSAGES.loading}</span>
        <div className="flex-[1_1_220px]">
          <Skeleton className="h-3.5 w-28 bg-white/15" />
          <Skeleton className="mt-3 h-7 w-3/4 bg-white/15" />
        </div>
        <Skeleton className="h-9 w-36 rounded-full bg-white/15" />
        <div className="flex-[1_1_220px]">
          <Skeleton className="h-3.5 w-24 bg-white/15" />
          <Skeleton className="mt-3 h-5 w-4/5 bg-white/15" />
        </div>
      </section>
    )
  }

  if (state.kind === "error") {
    return (
      <section
        aria-label="Temporada atual"
        className={`${CARD_CLASS} flex flex-wrap items-center justify-between gap-5`}
      >
        <div role="alert" className="flex flex-[1_1_280px] items-start gap-3.5">
          <CircleAlert
            className="mt-0.5 size-[22px] shrink-0 text-red-300"
            aria-hidden
          />
          <div>
            <h2 className="text-lg font-bold text-white">
              {ACTIVE_SEASON_MESSAGES.errorTitle}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-white/75">
              {ACTIVE_SEASON_MESSAGES.errorDescription}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-lime-accent/50"
        >
          <RefreshCw className="size-4" aria-hidden />
          {ACTIVE_SEASON_MESSAGES.retry}
        </button>
      </section>
    )
  }

  if (state.kind === "none") {
    return (
      <section
        aria-label="Temporada atual"
        className={`${CARD_CLASS} flex items-start gap-3.5`}
      >
        <CalendarX
          className="mt-0.5 size-[22px] shrink-0 text-lime-accent"
          aria-hidden
        />
        <div>
          <h2 className="text-lg font-bold text-white">
            {ACTIVE_SEASON_MESSAGES.noneTitle}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-white/75">
            {ACTIVE_SEASON_MESSAGES.noneDescription}
          </p>
        </div>
      </section>
    )
  }

  const { season } = state
  const statusLabel = SEASON_STATUS_LABELS[season.status] ?? season.status
  const period = formatRegistrationPeriod(
    season.registrationStartDate,
    season.registrationEndDate,
  )

  return (
    <section
      aria-labelledby="active-season-name"
      className={`${CARD_CLASS} flex flex-wrap items-center gap-x-10 gap-y-5`}
    >
      <div className="flex-[1_1_220px]">
        <p className="text-xs font-bold uppercase tracking-widest text-lime-accent">
          Temporada atual
        </p>
        <h2
          id="active-season-name"
          className="mt-1.5 text-[28px] font-extrabold tracking-tight text-white"
        >
          {season.name}
        </h2>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full bg-lime-accent/15 px-4 py-2 text-sm font-bold text-lime-accent">
        <span className="size-2 rounded-full bg-lime-accent" aria-hidden />
        {statusLabel}
      </span>
      {period && (
        <div className="flex-[1_1_220px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/65">
            Inscrições
          </p>
          <p className="mt-1.5 text-base font-medium text-white">{period}</p>
        </div>
      )}
    </section>
  )
}
