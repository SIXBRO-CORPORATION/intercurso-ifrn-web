"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"

export function ModalityBackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter()

  function goBack() {
    if (window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={goBack} className="-ml-3">
      <ArrowLeft aria-hidden /> Voltar
    </Button>
  )
}
