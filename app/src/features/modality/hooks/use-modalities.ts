"use client"

import { useQuery } from "@tanstack/react-query"
import { listAllModalities, listModalities } from "../repositories/modality-repository"

export function useModalities(seasonId?: string) {
  return useQuery({
    queryKey: ["modalities", seasonId ?? "all"],
    queryFn: ({ signal }) => listModalities(seasonId, signal),
  })
}

export function useAllModalities() {
  return useQuery({ queryKey: ["modalities", "admin"], queryFn: ({ signal }) => listAllModalities(signal) })
}
