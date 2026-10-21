"use client"

import Link from "next/link"
import { LayoutDashboard, LogIn } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { LoginButton } from "@/features/auth/components/login-button"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { DEFAULT_AUTHENTICATED_PATH } from "@/features/auth/constants"

const ACTION_CLASS =
  "h-11 rounded-full bg-white px-5 text-sm font-bold text-brand-950 hover:bg-white/90"

export function HomeAuthAction() {
  const { status } = useAuth()

  if (status === "authenticated") {
    return (
      <Button asChild size="lg" className={ACTION_CLASS}>
        <Link href={DEFAULT_AUTHENTICATED_PATH}>
          <LayoutDashboard aria-hidden />
          Ir para o painel
        </Link>
      </Button>
    )
  }

  return (
    <LoginButton className={ACTION_CLASS}>
      <LogIn aria-hidden />
      Entrar com SUAP
    </LoginButton>
  )
}
