import { Trophy } from "lucide-react"
import { cn } from "cn"

export function BrandMark({ tone = "dark" }: { tone?: "dark" | "light" }) {
    const light = tone === "light"
    return (
        <div className="flex items-center gap-3">
      <span
          className={cn(
              "grid size-10 place-items-center rounded-xl shadow-sm",
              light ? "bg-white text-brand-600" : "bg-brand-600 text-white",
          )}
      >
        <Trophy className="size-5" aria-hidden />
      </span>
            <span className="leading-none">
        <span
            className={cn(
                "block text-lg font-bold tracking-tight",
                light ? "text-white" : "text-brand-900",
            )}
        >
          Intercurso
        </span>
        <span
            className={cn(
                "block pt-1 text-[11px] font-semibold tracking-[0.2em]",
                light ? "text-brand-100" : "text-brand-600",
            )}
        >
          IFRN
        </span>
      </span>
        </div>
    )
}