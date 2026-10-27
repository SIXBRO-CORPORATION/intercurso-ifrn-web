"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { resolvePhotoSrc } from "../utils/modality-rules"

type ModalityPhotoProps = {
  src?: string | null
  fallback: ReactNode
  className?: string
}

export function ModalityPhoto({ src, fallback, className }: ModalityPhotoProps) {
  const resolved = resolvePhotoSrc(src)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!resolved || failedSrc === resolved) return <>{fallback}</>

  return (
      <Image
          src={resolved}
          alt=""
          width={96}
          height={96}
          unoptimized
          onError={() => setFailedSrc(resolved)}
          className={cn("shrink-0 rounded-full object-cover", className)}
      />
  )
}
