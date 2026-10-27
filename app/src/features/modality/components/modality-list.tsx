"use client"

import { useModalities } from "../hooks/use-modalities"
import { ModalityCard } from "./modality-card"
import { ModalityListLoading, ModalityMessage } from "./modality-list-states"

export function ModalityList({ seasonId }: { seasonId?: string }) {
  const modalities = useModalities(seasonId)

  if (modalities.status === "loading") return <ModalityListLoading />
  if (modalities.status === "error") {
    return (
        <ModalityMessage alert title="Não foi possível carregar as modalidades." onRetry={modalities.retry}>
          Verifique sua conexão e tente novamente.
        </ModalityMessage>
    )
  }
  if (modalities.data.length === 0) {
    return (
        <ModalityMessage title="Nenhuma modalidade ativa.">
          Ainda não há modalidades abertas para esta temporada.
        </ModalityMessage>
    )
  }

  return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modalities.data.map((modality) => (
            <li key={modality.modality_id}>
              <ModalityCard modality={modality} />
            </li>
        ))}
      </ul>
  )
}
