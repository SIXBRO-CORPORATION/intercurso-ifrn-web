"use client"

import { Button } from "@/shared/components/ui/button"
import { useAuth } from "@/features/auth/contexts/auth-context"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Olá, {user?.name}</h1>
      <Button variant="outline" onClick={() => void logout()}>
        Sair
      </Button>
    </main>
  )
}
