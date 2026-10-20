import { fieldClass } from "@/shared/components/ui/field-class"
import { SEASON_STATUS_LABEL } from "../constants"
import type { Season } from "../schemas/season-schema"

type Props = {
  seasons: Season[]
  status: "loading" | "error" | "success"
  value: string
  onChange: (seasonId: string) => void
}

export function SeasonSelect({ seasons, status, value, onChange }: Props) {
  const hint =
    status === "error"
      ? "Não foi possível carregar as temporadas. Recarregue a página."
      : status === "success" && !seasons.length
        ? "Nenhuma temporada disponível."
        : null

  return (
    <div className="space-y-1.5">
      <label htmlFor="season" className="text-xs font-semibold uppercase tracking-wider text-brand-700">
        Temporada
      </label>
      <select
        id="season"
        className={fieldClass}
        value={value}
        disabled={status !== "success" || !seasons.length}
        aria-describedby={hint ? "season-hint" : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        {status === "loading" && <option value="">Carregando…</option>}
        {status === "success" && !value && <option value="">Selecione uma temporada</option>}
        {seasons.map((s) => (
          <option key={s.season_id} value={s.season_id}>
            {s.name} · {s.year} ({SEASON_STATUS_LABEL[s.status] ?? s.status})
          </option>
        ))}
      </select>
      {hint && (
        <p id="season-hint" role={status === "error" ? "alert" : undefined} className="text-xs text-red-700">
          {hint}
        </p>
      )}
    </div>
  )
}
