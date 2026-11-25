import { Trophy } from "lucide-react"
import type { Modality } from "@/features/modality"
import { Card, CardHeader } from "@/shared/components/ui/card"
import { Chip } from "@/shared/components/ui/chip"

type Props = { modalities: Modality[]; selected: string; onSelect: (modalityId: string) => void }

const options = (modalities: Modality[]) => [
  { id: "", name: "Todas" },
  ...modalities.map((m) => ({ id: m.modality_id, name: m.name })),
]

/** Coluna lateral no desktop largo. */
export function ModalityMenu({ modalities, selected, onSelect }: Props) {
  return (
    <Card>
      <CardHeader title="Modalidades" />
      <ul>
        {options(modalities).map(({ id, name }) => (
          <li key={id}>
            <button
              type="button"
              aria-pressed={selected === id}
              onClick={() => onSelect(id)}
              className="flex h-10 w-full items-center gap-2.5 px-4 text-left font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset aria-pressed:bg-selected aria-pressed:font-semibold"
            >
              <Trophy className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{name}</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/** Faixa de chips nas telas menores. */
export function ModalityChips({ modalities, selected, onSelect }: Props) {
  return (
    <div role="group" aria-label="Modalidade" className="flex gap-1.5 overflow-x-auto p-1">
      {options(modalities).map(({ id, name }) => (
        <Chip key={id} selected={selected === id} onClick={() => onSelect(id)}>
          {name}
        </Chip>
      ))}
    </div>
  )
}
