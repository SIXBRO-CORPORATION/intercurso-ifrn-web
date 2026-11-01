"use client"

import Image from "next/image"
import Link from "next/link"
import { LoginButton } from "@/features/auth/components/login-button"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { DEFAULT_AUTHENTICATED_PATH } from "@/features/auth/constants"
import { Button } from "@/shared/components/ui/button"

// O botão de login nunca bloqueia a página: enquanto a sessão carrega, ele já aparece.
export function HomeNavbar() {
  const { status } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-(--navbar-height) w-full max-w-(--container-public) items-center justify-between gap-4 px-6">
        <Link href="/home" aria-label="Intercurso IFRN — início" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
          <Image src="/lockup-intercurso.png" width={1100} height={240} alt="Intercurso IFRN · Campus Pau dos Ferros" priority className="h-10 w-auto" />
        </Link>
        {status === "authenticated" ? (
          <Button asChild size="sm">
            <Link href={DEFAULT_AUTHENTICATED_PATH}>Ir para o painel</Link>
          </Button>
        ) : (
          <LoginButton size="sm">Entrar com SUAP</LoginButton>
        )}
      </div>
    </header>
  )
}
