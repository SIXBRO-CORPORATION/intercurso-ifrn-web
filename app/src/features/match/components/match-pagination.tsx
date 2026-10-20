import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

type Props = { page: number; size: number; total: number; onPage: (page: number) => void }

export function MatchPagination({ page, size, total, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / size))
  return (
    <nav aria-label="Paginação" className="flex items-center justify-between gap-3">
      <Button variant="outline" size="lg" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft aria-hidden /> Anterior
      </Button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Página {page} de {pages}
      </p>
      <Button variant="outline" size="lg" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Próxima <ChevronRight aria-hidden />
      </Button>
    </nav>
  )
}
